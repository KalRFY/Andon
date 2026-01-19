-- Update fpart_change to NULL for invalid values like 'Nul', empty strings, or other non-sparepart values
UPDATE tb_error_log_2
SET fpart_change = NULL
WHERE fpart_change IS NOT NULL
  AND (TRIM(fpart_change) = ''
       OR LOWER(TRIM(fpart_change)) = 'nul'
       OR LOWER(TRIM(fpart_change)) = 'null'
       OR LOWER(TRIM(fpart_change)) = 'none'
       OR LOWER(TRIM(fpart_change)) = 'n/a'
       OR LENGTH(TRIM(fpart_change)) < 2);  -- Adjust as needed for other invalid values
