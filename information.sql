select * from usercred


select * from annualreport
select * from hotel_data
select * from socialmediapost
select * from users


ALTER TABLE socialmediapost
ADD COLUMN new_dtposted DATE;

UPDATE socialmediapost
SET new_dtposted = dtposted::date;

ALTER TABLE socialmediapost
DROP COLUMN dtposted;

ALTER TABLE socialmediapost
RENAME COLUMN new_dtposted TO dtposted;

SELECT COUNT(DISTINCT dtposted)
FROM socialmediapost;

