CREATE OR REPLACE VIEW active_case_view AS SELECT CR.case_id, CT.description AS crime_type, F.location, O.name AS officer_name, O.rank AS officer_rank,
OC.is_lead, CR.status, ROUND(SYSDATE - CR.start_date, 0) AS days_open FROM CASE_RECORD CR JOIN FIR F ON CR.fir_id = F.fir_id JOIN CRIME_TYPE CT ON F.crime_type_id = CT.crime_type_id
JOIN OFFICER_CASE OC ON CR.case_id = OC.case_id JOIN OFFICER O ON OC.officer_id = O.officer_id WHERE CR.status IN ('Open','Under Trial');
SELECT * FROM active_case_view ORDER BY days_open DESC;


CREATE OR REPLACE VIEW crime_summary_view AS SELECT CT.description AS crime_type, COUNT(F.fir_id) AS total_firs, SUM(CASE WHEN CR.status='Open' THEN 1 ELSE 0 END) AS open_cases,
SUM(CASE WHEN CR.status='Closed' THEN 1 ELSE 0 END) AS closed_cases FROM CRIME_TYPE CT LEFT JOIN FIR F ON CT.crime_type_id = F.crime_type_id
LEFT JOIN CASE_RECORD CR ON F.fir_id = CR.fir_id GROUP BY CT.description;
SELECT * FROM crime_summary_view ORDER BY total_firs DESC;

select * from criminal;


CREATE OR REPLACE TRIGGER trg_case_audit
AFTER UPDATE ON CASE_RECORD
FOR EACH ROW
WHEN (OLD.status != NEW.status)
BEGIN
    INSERT INTO SYSTEM_AUDIT_LOG (target_table, record_id, action_type, old_value, new_value)
    VALUES ('CASE_RECORD', :NEW.case_id, 'STATUS_CHANGE', :OLD.status, :NEW.status);
END;
/