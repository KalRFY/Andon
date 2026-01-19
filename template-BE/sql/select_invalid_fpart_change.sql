-- Select all problems where fpart_change has invalid values like 'Nul', empty strings, or other non-sparepart values
SELECT fid, fmc_name, ferror_name, fpart_change, fstart_time, fend_time
FROM problems
WHERE fpart_change IS NOT NULL
  AND (TRIM(fpart_change) = ''
       OR LOWER(TRIM(fpart_change)) = 'nul'
       OR LOWER(TRIM(fpart_change)) = 'null'
       OR LOWER(TRIM(fpart_change)) = 'none'
       OR LOWER(TRIM(fpart_change)) = 'n/a'
       OR LENGTH(TRIM(fpart_change)) < 2);  -- Adjust as needed for other invalid values
