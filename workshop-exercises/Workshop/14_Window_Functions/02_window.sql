select dest,
       uniquecarrier,
       flightnum,
       airtime,
       AVG (airtime) OVER (PARTITION BY dest,uniquecarrier)
from otp_r
where origin = 'BOS'
  and flightdate = '2009-11-30'::date
  and uniquecarrier in ('UA','US','DL' )
  and dest in ('ORD', 'PHL', 'ATL', 'LAG') 
group by dest,uniquecarrier,flightnum,airtime
;
