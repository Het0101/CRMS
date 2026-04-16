SET SERVEROUTPUT ON;
SET LINESIZE 200;
SET PAGESIZE 50;

SELECT F.fir_id, CT.description  AS crime_type, F.location, TO_CHAR(F.date_filed, 'DD-MON-YYYY')  AS date_filed, F.status
FROM FIR F, CRIME_TYPE CT
WHERE F.crime_type_id = CT.crime_type_id
ORDER BY F.date_filed DESC;


SELECT criminal_id,UPPER(name) AS criminal_name, LOWER(status) AS current_status, ROUND(MONTHS_BETWEEN(SYSDATE, dob) / 12, 0) AS age, SUBSTR(name, 1, 5) AS name_code
FROM CRIMINAL
ORDER BY name ASC;


SELECT officer_id, name, rank, department, LENGTH(name) AS name_length FROM OFFICER WHERE name LIKE '%Kumar%' OR name LIKE '%Nair%';


SELECT officer_id, name, rank, NVL(phone, 'Not Provided') AS phone, NVL(email, 'Not Provided') AS email FROM OFFICER;


SELECT fir_id, TO_CHAR(date_filed, 'DD-MON-YYYY') AS fmt1, TO_CHAR(date_filed, 'DD-MM-YY') AS fmt2, TO_CHAR(date_filed, 'DAY') AS day_name, 
TO_CHAR(date_filed, 'YEAR') AS year_spelled FROM FIR;


SELECT CR.case_id, F.location, CT.description AS crime, TO_CHAR(CR.start_date,'DD-MON-YYYY') AS opened_on, ROUND(SYSDATE - CR.start_date, 0) AS days_open
FROM CASE_RECORD CR, FIR F, CRIME_TYPE CT
WHERE CR.fir_id = F.fir_id AND F.crime_type_id = CT.crime_type_id AND CR.status = 'Open' ORDER BY days_open DESC;


SAVEPOINT before_close;
UPDATE CASE_RECORD SET status = 'Closed', close_date = SYSDATE WHERE case_id = 3003;
SELECT case_id, status, close_date FROM CASE_RECORD WHERE case_id = 3003;
ROLLBACK TO before_close;


SELECT hearing_id, case_id, TO_CHAR(hearing_date, 'DD-MON-YYYY') AS hearing, NEXT_DAY(hearing_date, 'MONDAY') AS next_monday, LAST_DAY(hearing_date) AS month_end FROM COURT_HEARING;


SELECT case_id, 'Currently Open' AS reason FROM CASE_RECORD WHERE  status = 'Open' UNION SELECT case_id, 'Had Hearing in 2026' AS reason FROM COURT_HEARING WHERE TO_CHAR(hearing_date,'YYYY') = '2026';


SELECT case_id FROM CASE_RECORD WHERE status = 'Under Trial' INTERSECT SELECT case_id FROM EVIDENCE;


SELECT criminal_id FROM FIR_CRIMINAL MINUS SELECT criminal_id FROM CRIMINAL WHERE status = 'Arrested';


SELECT CR.case_id, CT.description  AS crime_type, F.location, CR.status FROM CASE_RECORD CR, FIR F, CRIME_TYPE CT WHERE CR.fir_id = F.fir_id AND F.crime_type_id = CT.crime_type_id
AND NOT EXISTS (SELECT 1 FROM EVIDENCE E WHERE E.case_id = CR.case_id);


SELECT officer_id, name, rank, department FROM OFFICER WHERE officer_id NOT IN (SELECT officer_id FROM OFFICER_CASE);


SELECT C.criminal_id, C.name, ROUND(MONTHS_BETWEEN(SYSDATE,C.dob)/12) AS age FROM CRIMINAL C WHERE MONTHS_BETWEEN(SYSDATE, C.dob) >= SOME (SELECT MONTHS_BETWEEN(SYSDATE, O.join_date) FROM OFFICER O);


SELECT fir_id, location, status FROM FIR WHERE location IN (SELECT F2.location FROM FIR F2, CASE_RECORD CR, COURT_HEARING CH WHERE F2.fir_id = CR.fir_id AND CR.case_id = CH.case_id);


CREATE OR REPLACE VIEW active_case_view AS SELECT CR.case_id, CT.description AS crime_type, F.location, O.name AS officer_name, O.rank AS officer_rank,
OC.is_lead, CR.status, ROUND(SYSDATE - CR.start_date, 0) AS days_open FROM CASE_RECORD CR JOIN FIR F ON CR.fir_id = F.fir_id JOIN CRIME_TYPE CT ON F.crime_type_id = CT.crime_type_id
JOIN OFFICER_CASE OC ON CR.case_id = OC.case_id JOIN OFFICER O ON OC.officer_id = O.officer_id WHERE CR.status IN ('Open','Under Trial');
SELECT * FROM active_case_view ORDER BY days_open DESC;


CREATE OR REPLACE VIEW crime_summary_view AS SELECT CT.description AS crime_type, COUNT(F.fir_id) AS total_firs, SUM(CASE WHEN CR.status='Open' THEN 1 ELSE 0 END) AS open_cases,
SUM(CASE WHEN CR.status='Closed' THEN 1 ELSE 0 END) AS closed_cases FROM CRIME_TYPE CT LEFT JOIN FIR F ON CT.crime_type_id = F.crime_type_id
LEFT JOIN CASE_RECORD CR ON F.fir_id = CR.fir_id GROUP BY CT.description;
SELECT * FROM crime_summary_view ORDER BY total_firs DESC;


SELECT CT.description AS crime_type, COUNT(F.fir_id)  AS total_firs FROM FIR F, CRIME_TYPE CT WHERE F.crime_type_id = CT.crime_type_id GROUP BY CT.description ORDER BY total_firs DESC;


SELECT department, COUNT(officer_id) AS officer_count, MIN(join_date) AS earliest_join, MAX(join_date) AS latest_join FROM OFFICER GROUP BY department HAVING COUNT(officer_id) > 1 ORDER BY officer_count DESC;


SELECT criminal_id, name, status, TO_CHAR(dob,'DD-MON-YYYY') AS dob FROM CRIMINAL ORDER BY name ASC, status DESC;


SELECT E.evidence_id, E.case_id, CT.description AS crime_type, E.type AS evidence_type, O.name AS collected_by, TO_CHAR(E.evidence_date,'DD-MON-YYYY') AS date_collected
FROM EVIDENCE E, CASE_RECORD CR, FIR F, CRIME_TYPE CT, OFFICER O WHERE E.case_id = CR.case_id AND CR.fir_id = F.fir_id AND F.crime_type_id = CT.crime_type_id AND E.officer_id = O.officer_id
ORDER BY E.evidence_date DESC;


SELECT officer_id, officer_name, open_case_count
FROM (SELECT O.officer_id, O.name AS officer_name, COUNT(OC.case_id) AS open_case_count FROM OFFICER O, OFFICER_CASE OC, CASE_RECORD CR WHERE O.officer_id = OC.officer_id
AND OC.case_id   = CR.case_id AND CR.status = 'Open' GROUP BY O.officer_id, O.name)
WHERE open_case_count = (SELECT MAX(cnt) FROM (SELECT COUNT(OC2.case_id) cnt FROM OFFICER_CASE OC2, CASE_RECORD CR2 WHERE OC2.case_id = CR2.case_id AND CR2.status = 'Open' GROUP BY OC2.officer_id));


WITH avg_duration AS (SELECT AVG(SYSDATE - start_date) AS avg_days FROM CASE_RECORD WHERE status != 'Closed')
SELECT CR.case_id, CT.description AS crime_type, F.location, ROUND(SYSDATE - CR.start_date, 0) AS days_open, ROUND(AD.avg_days, 0) AS avg_days FROM CASE_RECORD CR, FIR F, CRIME_TYPE CT, avg_duration AD
WHERE CR.fir_id = F.fir_id AND F.crime_type_id = CT.crime_type_id AND (SYSDATE - CR.start_date) > AD.avg_days AND CR.status != 'Closed' ORDER BY days_open DESC;


WITH dept_exp AS (SELECT department, SUM(MONTHS_BETWEEN(SYSDATE, join_date)) AS total_months FROM OFFICER GROUP BY department), avg_exp AS (SELECT AVG(total_months) AS overall_avg FROM dept_exp)
SELECT DE.department, ROUND(DE.total_months / 12, 1) AS total_experience_years FROM dept_exp DE, avg_exp AE WHERE DE.total_months > AE.overall_avg ORDER BY total_experience_years DESC;


SELECT FC.criminal_id, C.name, C.status, COUNT(FC.fir_id) AS fir_count FROM FIR_CRIMINAL FC, CRIMINAL C WHERE FC.criminal_id = C.criminal_id GROUP BY FC.criminal_id, C.name, C.status HAVING COUNT(FC.fir_id) > 1 ORDER BY fir_count DESC;

SAVEPOINT before_reassign;
UPDATE OFFICER_CASE SET is_lead = 'N' WHERE  case_id = 3001 AND officer_id = 101;
INSERT INTO OFFICER_CASE VALUES (104, 3001, SYSDATE, 'Lead Investigator', 'Y');
COMMIT;

SAVEPOINT restore;
DELETE FROM OFFICER_CASE WHERE officer_id = 104 AND case_id = 3001;
UPDATE OFFICER_CASE SET is_lead = 'Y' WHERE case_id = 3001 AND officer_id = 101;
COMMIT;


SELECT C.criminal_id, C.name AS criminal_name, C.status, F.fir_id, CT.description AS crime_type, F.location, FC.role_in_crime FROM CRIMINAL C, FIR_CRIMINAL FC, FIR F, CRIME_TYPE CT
WHERE C.criminal_id = FC.criminal_id AND FC.fir_id = F.fir_id AND F.crime_type_id = CT.crime_type_id ORDER BY C.name, F.date_filed;

SELECT CR.case_id, CT.description AS crime_type, F.location, O.name AS officer_name, O.rank, OC.is_lead, C.name AS criminal_name, FC.role_in_crime FROM CASE_RECORD CR
JOIN FIR F ON CR.fir_id = F.fir_id JOIN CRIME_TYPE CT ON F.crime_type_id = CT.crime_type_id JOIN OFFICER_CASE OC ON CR.case_id = OC.case_id
JOIN OFFICER O ON OC.officer_id = O.officer_id JOIN FIR_CRIMINAL FC ON F.fir_id = FC.fir_id JOIN CRIMINAL C ON FC.criminal_id = C.criminal_id ORDER BY CR.case_id, O.name;

SELECT CR.case_id, CT.description AS crime_type, F.location, COUNT(E.evidence_id) AS evidence_count FROM CASE_RECORD CR, FIR F, CRIME_TYPE CT, EVIDENCE E
WHERE CR.fir_id = F.fir_id AND F.crime_type_id = CT.crime_type_id AND E.case_id = CR.case_id GROUP BY CR.case_id, CT.description, F.location HAVING COUNT(E.evidence_id) >= 2 ORDER BY evidence_count DESC;

SELECT COUNT(DISTINCT CR.case_id) AS total_cases, COUNT(DISTINCT F.fir_id) AS total_firs, COUNT(DISTINCT C.criminal_id) AS total_criminals,
COUNT(DISTINCT O.officer_id) AS total_officers, COUNT(DISTINCT E.evidence_id) AS total_evidence_items, COUNT(DISTINCT CH.hearing_id) AS total_hearings
FROM CASE_RECORD CR, FIR F, CRIMINAL C, OFFICER O, EVIDENCE E, COURT_HEARING CH;
