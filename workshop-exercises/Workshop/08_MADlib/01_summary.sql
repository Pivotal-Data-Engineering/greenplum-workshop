drop table if exists faa.otp_summary;
select * from madlib.summary(
 'faa.otp_r', 
 'faa.otp_summary', 
 'arrdelayminutes, depdelayminutes',
 NULL,
 FALSE,
 FALSE,
 NULL,
 10,
 FALSE);
\x on
select * from faa.otp_summary;