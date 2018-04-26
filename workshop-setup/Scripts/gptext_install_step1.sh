#!/usr/bin/env bash

#############################################################################################
# Execute as the gpadmin user
#
# Install GPText 2.2.1 binaries on all hosts
#############################################################################################

[[ $(id -nu) != 'gpadmin' ]] && { echo 'Must be run as gpadmin. Exiting'; exit 1; }

BIN_DIR=/data4/software
GPTEXT_INSTALL_BINARY='greenplum-text-2.2.1-rhel6_x86_64.bin'
HOST_ALL=/home/gpadmin/all_hosts.txt

psql -d template1 -c 'select 1' > /dev/null 2>&1
if [[ $? != 0 ]]; then
    echo Unable to access Greenplum db. Please start the database and try again. Exiting.
    exit 1
fi

# Verify version of java. If needed, install openjdk 1.8 or greater from yum.
v=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}')
[[ $v < 1.8 ]] && gpssh -f ${HOST_ALL} -e "sudo yum -q -y install java-1.8.0-openjdk.x86_64"

# Install 'nc' and 'lsof' on all hosts for zookeeper
gpssh -f ${HOST_ALL} -e "sudo yum -q -y install nc lsof"

###################################################################################
# Install GPText binaries
# Allow gpadmin to create what is needed in /usr/local.
# We change the permissions back to 755 before leaving the script
gpssh -f ${HOST_ALL} -e "sudo chmod 777 /usr/local"

rm -rf /usr/local/greenplum-text* /usr/local/greenplum-solr

BASHRC=$HOME/.bashrc
GPTEXT_ENV_PATH="/usr/local/greenplum-text/greenplum-text_path.sh"

if ! $(grep $GPTEXT_ENV_PATH $BASHRC); then
   echo "source $GPTEXT_ENV_PATH" >> $BASHRC
fi

GPT_CFG=/tmp/gptext_config
cat << _EOF > $GPT_CFG
declare -a GPTEXT_HOSTS=(localhost)
declare -a DATA_DIRECTORY=(/data1/gptext/primary /data1/gptext/primary)
JAVA_OPTS="-Xms1024M -Xmx2048M"
GPTEXT_PORT_BASE=18983
GP_MAX_PORT_LIMIT=28983
ZOO_CLUSTER="BINDING"
declare -a ZOO_HOSTS=(localhost localhost localhost)
ZOO_DATA_DIR="/data1/gptext/master/"
ZOO_GPTXTNODE="gptext"
ZOO_PORT_BASE=2188
ZOO_MAX_PORT_LIMIT=12188
_EOF

echo -e 'yes\n\nyes\n' | MORE=-1000 ${BIN_DIR}/$GPTEXT_INSTALL_BINARY -c ${GPT_CFG}

# Get the directory path (make sure we only return one) to create the soft link
GPTEXT_DIR=$(find /usr/local -name 'greenplum-text-*' | tail -1)
gpssh -f ${HOST_ALL} -e "ln -s $GPTEXT_DIR /usr/local/greenplum-text"

gpssh -f ${HOST_ALL} -e "sudo chmod 755 /usr/local"