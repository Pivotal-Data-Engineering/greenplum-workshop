#!/usr/bin/env bash

#############################################################################################
# Executed by the gpadmin user.
#
# Configure an AWS Greenplum cluster for the Greenplum workshop.
# The following activites are performed in this script:
# - Create a directory for storing downloaded software packages.
# - Run gpupgrade. We modifiy it slightly to pull from a development
#    repository. Upgrades the cluster from GP 5.2 -> 5.7+
# - Modify the pg_hba.conf file and reload changes or start up GP.
# - Adds the gpuser role and creates the gpuser database.
# - Download the Greenplum software packages used for this workshop.
# - Install MadLib, GPText, and PLContainer.
# - Restart Greenplum
#############################################################################################

source ./00_common_functions.sh
GP_ENV="/usr/local/greenplum-db/greenplum_path.sh"
if [[ ! -x ${GP_ENV} ]]; then
    echo "File '${GP_ENV}' not found. Is Greenplum installed?"
    exit 1
else
    source ${GP_ENV}
fi

echo_eval "check_user gpadmin"
[[ $? == 1 ]] && exit 1

SOFTWARE=/${DATA_DISK:-/data1}/software

####################################################################
# Usage: modify_pghba
#
# Modify the Greenplum pg_hba.conf file
function modify_pghba() 
{
    rc=0
    PGHBA=$MASTER_DATA_DIRECTORY/pg_hba.conf
    echo_eval "cp ${PGHBA} ${PGHBA}.SAVED"

    # Delete any gpuser or 'catch-all entries. We have our own we will use.
    # NOTE: Assumption is we are using GNU version of sed.
    sed -i -r -e '/local[[:space:]]+all[[:space:]]+gpuser[[:space:]].*/ d' \
           -e '/host[[:space:]]+all[[:space:]]+all[[:space:]]+0.0.0.0\/0[[:space:]]+.*/ d' \
           -e '/host[[:space:]]+all[[:space:]]+all[[:space:]]+::1\/128[[:space:]]+.*/ d' ${PGHBA}
    cat << _EOF >> ${PGHBA}
##### Entries below added by GPDB workshop ######
local   all    gpuser                ident
host    all    all      0.0.0.0/0    trust
host    all    all      ::1/128      trust
_EOF

    echo_eval "unset PGDATABASE PGUSER"
    echo_eval "gpstate -q"
    if [[ $? == 0 ]] ; then
       echo "GPDB: Reload pg_hba.conf changes"
       echo_eval "gpstop -u"
    else
       echo "GPDB: Starting"
       echo_eval "gpstart -aq"
    fi
    [[ $? -ne 0 ]] && { echo "Problems running gpstop/gpstart. Exiting." ; rc=1 ; }

    return $rc
}

####################################################################
# Usage: add_role_and_db <NEW ROLE> <NEW DB>
#
# Add the workshop user/role to Greenplum
function add_role_and_db()
{
    ROLE=$1
    NEWDB=$2

    PASSWD="pivotal"

    rc=0
    # Add the gpuser role to the db if it doesn't already exist
    echo_eval "psql -d postgres -ec '\du' | grep -w $ROLE"
    if [ $? -ne 0 ] ; then
        echo "Creating database role ${ROLE}"
            expect << _EOF
set timeout -1
spawn bash -l
match_max 10000
expect -exact "$ "
send -- "createuser --echo --pwprompt --login --no-createdb --no-superuser --no-createrole\r"
expect -exact "Enter name of role to add: "
send -- "${ROLE}\r"
expect -exact "Enter password for new role: "
send -- "${PASSWD}\r"
expect -exact "Enter it again: "
send -- "${PASSWD}\r"
expect -exact "$ "
send -- "exit\r"
expect -exact "$ "
_EOF
    fi

    # Create the $NEWDB database if it doesn't already exist
    # This step must occur for the remainder of the install to work so
    # we try 3 times in case something has a temporary lock on template1
    for cnt in $(seq 1 3); do
        dbname=$(psql -d postgres -Atc "select datname from pg_database where datname = '${NEWDB}'")
        if [[ "x${dbname}" == "x" ]] ; then
            echo "Creating '${NEWDB}' database"
            echo_eval "psql -d postgres -e -c 'create database ${NEWDB} owner = ${ROLE}'"
        else
            echo_eval "psql -d postgres -e -c 'alter database ${NEWDB} owner to ${ROLE};'"
        fi
        rc=$?
        [[ $rc == 0 ]] && { break ; }
        sleep 2
    done

    if [[ $rc == 0 ]]; then
        # add the $WORKSHOP_DB to pgbouncer
        PGB_INI=$(find $(dirname $MASTER_DATA_DIRECTORY) -name pgbouncer.ini)
        sed -i -e "/\[databases\]/a ${ROLE} = host=127.0.0.1 port=6432 dbname=${NEWDB}" \
               -e "s/^auth_type.*/auth_type = trust/"   $PGB_INI
        pgbouncer -d -R $PGB_INI

        echo_eval "psql -d ${NEWDB} -e -c 'alter role ${ROLE} createexttable;'"
    fi

    return $rc 
}

####################################################################
# Usage: download_software <list of software delimited by a [space]
#
# Download the Greenplum software packages used for this workshop
function download_software()
{
    for f in $@
    do
        echo_eval "curl -s https://s3.amazonaws.com/gp-demo-workshop/$f -o ${SOFTWARE}/$f"
    done
}

####################################################################
# Usage: install_madlib_pkg <PKG>
#
# Install Madlib
function install_madlib_pkg()
{
    PKG=$1

    # Check if madlib is already installed
    gppkg -q --all | grep madlib &> /dev/null
    if [[ $? -ne 0 ]]; then
        echo_eval "tar xzf ${SOFTWARE}/${PKG} -C ${SOFTWARE}"
        MADLIB=$(basename ${PKG} .tar.gz)

        echo_eval "gppkg -i ${SOFTWARE}/${MADLIB}/${MADLIB}.gppkg"
    fi
}

####################################################################
# Usage: install_madlib_schema <DB> <USER>
#
# Install Madlib schema and functions in DB and grant usage to USER
function install_madlib_schema()
{
    if [[ -z $1 ]] | [[ -z $2 ]]; then
        echo 'Usage: install_madlib_schema <DB> <USER>'
        return 1
    fi

    DB=$1
    USER=$2

    master_host=$(hostname)

    if [[ ! -z $DB ]]; then
        echo_eval "${GPHOME}/madlib/bin/madpack install -s madlib -p greenplum -c gpadmin@${master_host}:${PGPORT:-5432}/${DB}"
        echo_eval "psql -d ${DB} -ec 'grant all privileges on schema madlib to ${USER};'"
    fi
}

####################################################################
# Usage: install_gptext <PKG>
#
# Install GPText
function install_gptext()
{
    PKG=$1

    echo_eval "tar xzf ${SOFTWARE}/${PKG} -C ${SOFTWARE}"
    ./02a_gptext_install_1.sh ${PKG}
    ./02a_gptext_install_2.sh
}

####################################################################
# Usage: install_plcontainer <PKG> <IMAGE> <LANGUAGE>
#
# Install PLContainer
function install_plcontainer()
{
    PKG=$1
    IMAGE=$2
    LANG=$3

    echo_eval "gppkg -i ${SOFTWARE}/${PKG}"
    rc=$?
    if [[ $rc == 0 ]]; then
        echo_eval "plcontainer image-add -f ${SOFTWARE}/${IMAGE}"
        echo_eval "plcontainer runtime-add -r plc_${LANG} -i pivotaldata/plcontainer_${LANG}_shared:devel -l ${LANG}"
        for db in gpadmin ${WORKSHOP_DB}
        do
            echo_eval "psql -d ${db} -c 'create extension plcontainer'"
        done
    fi

    PLC_TBLS="public.plcontainer_show_config,public.plcontainer_refresh_config"
    psql -d gpadmin -ec "grant select on ${PLC_TBLS} to ${WORKSHOP_USER};"
    psql -d ${WORKSHOP_DB} -ec "grant select on ${PLC_TBLS} to ${WORKSHOP_USER};"

    return $rc
}

####################################################################
# Usage: upgrad_gpdb
#
# Upgrade to latest release (5.16 as of Feb 2019)
# Modifies the gpupgrade.sh script to access a separate software
# repository on S3 so we can incorporate newer release faster
# than the marketplace offering.

function upgrade_gpdb()
{
    UPGRADE_SCRIPT=$(find /usr/local -name gpupgrade.sh | tail -1)
    if [[ -x $UPGRADE_SCRIPT ]]; then
        echo_eval "sudo sed -i 's?s3.amazonaws.com/pivotal-greenplum-bin?s3.amazonaws.com/gp-demo-workshop/pivotal-greenplum-dev?' $UPGRADE_SCRIPT"
        [[ $? == 0 ]] && echo_eval "$UPGRADE_SCRIPT true"
        if [[ $? == 0 ]]; then
            # Clean up by removing the RPM installer
            rpm_file=$(tail -1 /tmp/greenplum_upgrade/control.txt | cut -d'|' -f3)
            [[ ${rpm_file: -4} == '.rpm' ]] && sudo find / -name $rpm_file -exec rm -f {} \;
        fi
    fi
}

####################################################################
# MAIN
####################################################################

# Updated software list to latest versions as of 2019Feb04
GPTEXT_INSTALLER="greenplum-text-3.1.0-rhel6_x86_64.tar.gz"
GPCC_INSTALLER="greenplum-cc-web-4.5.1-LINUX-x86_64.zip"
MADLIB_INSTALLER="madlib-1.15.1-gp5-rhel7-x86_64.tar.gz"
PLC_INSTALLER="plcontainer-1.4.0-rhel7-x86_64.gppkg"
PLC_IMAGE="plcontainer-python-images-1.4.0.tar.gz"

[[ ! -d $SOFTWARE ]] && echo_eval "mkdir -p $SOFTWARE"

upgrade_gpdb; [[ $? == 1 ]] && exit
modify_pghba; [[ $? == 1 ]] && exit
add_role_and_db $WORKSHOP_USER $WORKSHOP_DB; [[ $? == 1 ]] && exit
download_software $GPTEXT_INSTALLER $GPCC_INSTALLER $MADLIB_INSTALLER $PLC_INSTALLER $PLC_IMAGE

if [[ ! -z $MADLIB_INSTALLER ]]; then
    install_madlib_pkg $MADLIB_INSTALLER
    install_madlib_schema $WORKSHOP_DB $WORKSHOP_USER
fi

# Removing the installation of PLContainer since we are loading PostGIS
# and as of Feb 2019 there is a bug where the two cannot be installed at the same time.
#[[ ! -z $PLC_INSTALLER ]]    && install_plcontainer $PLC_INSTALLER $PLC_IMAGE python
[[ ! -z $GPTEXT_INSTALLER ]] && install_gptext $GPTEXT_INSTALLER

/bin/mv ./Scripts/cluster_st*.sh /home/gpadmin
# Restart the database to make sure all the changes take effect
echo_eval "gpstop -q -r -a -M fast"
