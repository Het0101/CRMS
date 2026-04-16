SET SERVEROUTPUT ON;

DECLARE
v_caseid CASE_RECORD.case_id%TYPE := 3001;
v_status CASE_RECORD.status%TYPE;
v_crime CRIME_TYPE.description%TYPE;
v_location FIR.location%TYPE;
v_evd_cnt NUMBER;
v_hear_cnt NUMBER;

                                                                                
BEGIN
SELECT CR.status, CT.description, F.location INTO v_status, v_crime, v_location FROM CASE_RECORD CR JOIN FIR F ON CR.fir_id = F.fir_id JOIN CRIME_TYPE CT ON F.crime_type_id = CT.crime_type_id AND CR.case_id = v_caseid;
SELECT COUNT(*) INTO v_evd_cnt FROM EVIDENCE WHERE case_id = v_caseid;
SELECT COUNT(*) INTO v_hear_cnt FROM COURT_HEARING WHERE case_id = v_caseid;

DBMS_OUTPUT.PUT_LINE('========== CASE SUMMARY ==========');
DBMS_OUTPUT.PUT_LINE('Case ID   : ' || v_caseid);
DBMS_OUTPUT.PUT_LINE('Crime Type: ' || v_crime);
DBMS_OUTPUT.PUT_LINE('Location  : ' || v_location);
DBMS_OUTPUT.PUT_LINE('Status    : ' || v_status);
DBMS_OUTPUT.PUT_LINE('Evidence  : ' || v_evd_cnt || ' items');
DBMS_OUTPUT.PUT_LINE('Hearings  : ' || v_hear_cnt);

IF v_evd_cnt = 0 THEN DBMS_OUTPUT.PUT_LINE('WARNING: No evidence on record!');
ELSIF v_evd_cnt < 3 THEN DBMS_OUTPUT.PUT_LINE('NOTE: Limited evidence - collect more.');
ELSE DBMS_OUTPUT.PUT_LINE('Evidence: Sufficient');
END IF;

EXCEPTION
WHEN NO_DATA_FOUND THEN DBMS_OUTPUT.PUT_LINE('ERROR: Case ' || v_caseid || ' not found.');
WHEN TOO_MANY_ROWS THEN DBMS_OUTPUT.PUT_LINE('ERROR: Duplicate data detected.');
WHEN OTHERS THEN DBMS_OUTPUT.PUT_LINE('Unexpected: ' || SQLERRM);
END;
/


DECLARE v_count NUMBER;
BEGIN
DBMS_OUTPUT.PUT_LINE(RPAD('Criminal',25) || RPAD('Status',15) || 'FIR Count');
DBMS_OUTPUT.PUT_LINE(RPAD('-',60,'-'));
FOR rec IN (SELECT criminal_id, name, status FROM CRIMINAL ORDER BY name) LOOP
SELECT COUNT(*) INTO v_count FROM FIR_CRIMINAL WHERE criminal_id = rec.criminal_id;
DBMS_OUTPUT.PUT_LINE(RPAD(rec.name,25) || RPAD(rec.status,15) || v_count);
END LOOP;
END;
/


DECLARE
v_status CASE_RECORD.status%TYPE;
v_id CASE_RECORD.case_id%TYPE := 3003;
BEGIN
SELECT status INTO v_status FROM CASE_RECORD WHERE case_id = v_id;
IF v_status = 'Closed' THEN GOTO already_done;
END IF;
DBMS_OUTPUT.PUT_LINE('Processing case ' || v_id || '...');
DBMS_OUTPUT.PUT_LINE('Case processed.');
GOTO done;
<<already_done>>
DBMS_OUTPUT.PUT_LINE('Case ' || v_id || ' already closed. Skipping.');
<<done>>
DBMS_OUTPUT.PUT_LINE('End of block.');
END;
/


DECLARE
v_case NUMBER := 3001;
v_id OFFICER.officer_id%TYPE;
v_name OFFICER.name%TYPE;
v_rank OFFICER.rank%TYPE;
v_role OFFICER_CASE.role%TYPE;
v_lead OFFICER_CASE.is_lead%TYPE;
CURSOR c_off(p_case NUMBER) IS SELECT O.officer_id, O.name, O.rank, OC.role, OC.is_lead FROM OFFICER O JOIN OFFICER_CASE OC ON O.officer_id = OC.officer_id WHERE OC.case_id = p_case ORDER BY OC.is_lead DESC, O.name;
BEGIN
OPEN c_off(v_case);
DBMS_OUTPUT.PUT_LINE('Officers for Case ' || v_case || ':');
DBMS_OUTPUT.PUT_LINE(RPAD('-',60,'-'));
LOOP
FETCH c_off
INTO v_id, v_name, v_rank, v_role, v_lead;
EXIT WHEN c_off%NOTFOUND;
DBMS_OUTPUT.PUT_LINE(RPAD(v_name,20) || RPAD(v_rank,15) || RPAD(v_role,25) || '  Lead: ' || v_lead);
END LOOP;
DBMS_OUTPUT.PUT_LINE('Total officers: ' || c_off%ROWCOUNT);
CLOSE c_off;
EXCEPTION WHEN OTHERS THEN
IF c_off%ISOPEN THEN CLOSE c_off; END IF;
END;
/


DECLARE
CURSOR c_cases IS SELECT CR.case_id, CT.description AS crime, F.location, CR.status FROM CASE_RECORD CR, FIR F, CRIME_TYPE CT WHERE CR.fir_id = F.fir_id AND F.crime_type_id = CT.crime_type_id ORDER BY CR.case_id;
v_evd_count NUMBER;
BEGIN
FOR rec IN c_cases LOOP
SELECT COUNT(*) INTO v_evd_count FROM EVIDENCE WHERE case_id = rec.case_id;
DBMS_OUTPUT.PUT_LINE('Case:' || rec.case_id ||'  Crime:' || RPAD(rec.crime,15) ||'  Status:' || RPAD(rec.status,12) ||'  Evidence:' || v_evd_count);
END LOOP;
END;
/


DECLARE
CURSOR c_crim IS SELECT FC.criminal_id FROM FIR_CRIMINAL FC, FIR F, CASE_RECORD CR WHERE FC.fir_id = F.fir_id AND F.fir_id = CR.fir_id AND CR.status = 'Closed' FOR UPDATE OF FC.role_in_crime;
BEGIN
FOR rec IN c_crim LOOP
UPDATE FIR_CRIMINAL SET role_in_crime = 'Accused' WHERE  CURRENT OF c_crim;
END LOOP;
COMMIT;
DBMS_OUTPUT.PUT_LINE('Roles updated for closed cases.');
END;
/


DECLARE
CURSOR c_crim_by_crime(p_type VARCHAR2) IS SELECT DISTINCT C.criminal_id, C.name, C.status, FC.role_in_crime FROM CRIMINAL C, FIR_CRIMINAL FC, FIR F, CRIME_TYPE CT WHERE C.criminal_id = FC.criminal_id AND FC.fir_id = F.fir_id
AND F.crime_type_id = CT.crime_type_id AND CT.description = p_type;
BEGIN
DBMS_OUTPUT.PUT_LINE('Criminals involved in THEFT cases:');
FOR rec IN c_crim_by_crime('Theft') LOOP
DBMS_OUTPUT.PUT_LINE(rec.criminal_id || ' | ' || RPAD(rec.name,20) || ' | ' || rec.status || ' | ' || rec.role_in_crime);
END LOOP;
END;
/


CREATE OR REPLACE PROCEDURE assign_officer (p_officer_id IN OFFICER_CASE.officer_id%TYPE, p_case_id IN OFFICER_CASE.case_id%TYPE, p_role IN OFFICER_CASE.role%TYPE
DEFAULT 'Investigating Officer', p_is_lead IN OFFICER_CASE.is_lead%TYPE DEFAULT 'N') IS v_exists NUMBER;
Already_Assigned EXCEPTION;
Case_Not_Found EXCEPTION;
v_case_check NUMBER;
BEGIN
SELECT COUNT(*) INTO v_case_check FROM CASE_RECORD WHERE case_id = p_case_id;
IF v_case_check = 0 THEN RAISE Case_Not_Found;
END IF;
SELECT COUNT(*) INTO v_exists FROM OFFICER_CASE WHERE officer_id = p_officer_id AND case_id = p_case_id;
IF v_exists > 0 THEN RAISE Already_Assigned;
END IF;
IF p_is_lead = 'Y' THEN UPDATE OFFICER_CASE SET is_lead = 'N' WHERE  case_id = p_case_id;
END IF;
INSERT INTO OFFICER_CASE VALUES (p_officer_id, p_case_id, SYSDATE, p_role, p_is_lead);
COMMIT;
DBMS_OUTPUT.PUT_LINE('Officer ' || p_officer_id || ' assigned to Case ' || p_case_id || ' as ' || p_role);
EXCEPTION
WHEN Already_Assigned THEN DBMS_OUTPUT.PUT_LINE('ERROR: Officer already assigned to this case.');
WHEN Case_Not_Found THEN DBMS_OUTPUT.PUT_LINE('ERROR: Case ID ' || p_case_id || ' does not exist.');
WHEN OTHERS THEN ROLLBACK;
DBMS_OUTPUT.PUT_LINE('ERROR: ' || SQLERRM);
END assign_officer;
/

BEGIN
assign_officer(107, 3001, 'Supporting Officer', 'N');
END;
/



CREATE OR REPLACE PROCEDURE list_fir_criminals (p_fir_id IN FIR.fir_id%TYPE) IS
CURSOR c IS SELECT C.name, C.status, FC.role_in_crime FROM CRIMINAL C, FIR_CRIMINAL FC WHERE C.criminal_id = FC.criminal_id AND FC.fir_id = p_fir_id;
v_count NUMBER := 0;
BEGIN
DBMS_OUTPUT.PUT_LINE('Criminals in FIR ' || p_fir_id || ':');
FOR rec IN c LOOP
v_count := v_count + 1;
DBMS_OUTPUT.PUT_LINE(v_count || '. ' || RPAD(rec.name,20) || ' | ' || RPAD(rec.status,12) || ' | ' || rec.role_in_crime);
END LOOP;
IF v_count = 0 THEN DBMS_OUTPUT.PUT_LINE('No criminals linked to this FIR.');
END IF;
END list_fir_criminals;
/

BEGIN list_fir_criminals(1001);
END;
/


CREATE OR REPLACE FUNCTION get_open_case_count (p_officer_id IN OFFICER.officer_id%TYPE) RETURN NUMBER IS v_count NUMBER;
BEGIN
SELECT COUNT(*) INTO v_count FROM OFFICER_CASE OC, CASE_RECORD CR WHERE OC.officer_id = p_officer_id AND OC.case_id = CR.case_id AND CR.status = 'Open';
RETURN v_count;
EXCEPTION WHEN OTHERS THEN RETURN 0;
END get_open_case_count;
/

SELECT officer_id, name, rank, get_open_case_count(officer_id) AS open_cases FROM OFFICER ORDER BY open_cases DESC;


CREATE OR REPLACE FUNCTION get_criminal_age (p_criminal_id IN CRIMINAL.criminal_id%TYPE) RETURN NUMBER IS v_dob CRIMINAL.dob%TYPE;
BEGIN SELECT dob INTO v_dob FROM CRIMINAL WHERE criminal_id = p_criminal_id;
RETURN FLOOR(MONTHS_BETWEEN(SYSDATE, v_dob) / 12);
EXCEPTION
WHEN NO_DATA_FOUND THEN RETURN -1;
END get_criminal_age;
/

SELECT criminal_id, name, get_criminal_age(criminal_id) AS age FROM CRIMINAL;



CREATE OR REPLACE PROCEDURE close_case (p_case_id IN CASE_RECORD.case_id%TYPE, p_days_open OUT NUMBER) IS v_start DATE;
v_status CASE_RECORD.status%TYPE;
BEGIN
SELECT status, start_date INTO v_status, v_start FROM CASE_RECORD WHERE case_id = p_case_id;
IF v_status = 'Closed' THEN DBMS_OUTPUT.PUT_LINE('Case already closed.');
p_days_open := 0;
RETURN;
END IF;
UPDATE CASE_RECORD SET status = 'Closed', close_date = SYSDATE WHERE case_id = p_case_id;
COMMIT;
p_days_open := ROUND(SYSDATE - v_start, 0);
DBMS_OUTPUT.PUT_LINE('Case ' || p_case_id || ' closed after ' || p_days_open || ' days.');
EXCEPTION
WHEN NO_DATA_FOUND THEN DBMS_OUTPUT.PUT_LINE('ERROR: Case not found.');
p_days_open := -1;
END close_case;
/

DECLARE
v_days NUMBER;
BEGIN
close_case(3006, v_days);
DBMS_OUTPUT.PUT_LINE('Days open: ' || v_days);
END;
/




CREATE OR REPLACE PACKAGE CRMS_PKG AS FUNCTION get_open_case_count(p_officer_id NUMBER) RETURN NUMBER;
FUNCTION get_criminal_age(p_criminal_id NUMBER) RETURN NUMBER;
PROCEDURE list_case_criminals(p_case_id NUMBER);
PROCEDURE dept_report(p_department VARCHAR2);
END CRMS_PKG;
/

CREATE OR REPLACE PACKAGE BODY CRMS_PKG AS FUNCTION get_open_case_count(p_officer_id NUMBER) RETURN NUMBER IS v NUMBER;
BEGIN
SELECT COUNT(*) INTO v FROM OFFICER_CASE OC, CASE_RECORD CR WHERE OC.officer_id = p_officer_id AND OC.case_id = CR.case_id AND CR.status = 'Open';
RETURN v;
EXCEPTION WHEN OTHERS THEN RETURN 0;
END;

FUNCTION get_criminal_age(p_criminal_id NUMBER) RETURN NUMBER IS v_dob DATE;
BEGIN
SELECT dob INTO v_dob FROM CRIMINAL WHERE criminal_id = p_criminal_id;
RETURN FLOOR(MONTHS_BETWEEN(SYSDATE, v_dob) / 12);
EXCEPTION WHEN OTHERS THEN RETURN -1;
END;

PROCEDURE list_case_criminals(p_case_id NUMBER) IS
BEGIN
DBMS_OUTPUT.PUT_LINE('--- Criminals in Case ' || p_case_id || ' ---');
FOR rec IN (SELECT C.name, C.status, FC.role_in_crime FROM CRIMINAL C, FIR_CRIMINAL FC, FIR F, CASE_RECORD CR WHERE C.criminal_id = FC.criminal_id AND FC.fir_id = F.fir_id AND F.fir_id = CR.fir_id AND CR.case_id = p_case_id)
LOOP
DBMS_OUTPUT.PUT_LINE(rec.name || ' (' || rec.status || ') — ' || rec.role_in_crime);
END LOOP;
END;

PROCEDURE dept_report(p_department VARCHAR2) IS
BEGIN
DBMS_OUTPUT.PUT_LINE('=== Department: ' || p_department || ' ===');
FOR rec IN (SELECT DISTINCT CR.case_id, CT.description AS crime, CR.status FROM CASE_RECORD CR, FIR F, CRIME_TYPE CT, OFFICER_CASE OC, OFFICER O WHERE CR.fir_id = F.fir_id AND F.crime_type_id = CT.crime_type_id
AND CR.case_id = OC.case_id AND OC.officer_id = O.officer_id AND O.department = p_department ORDER BY CR.case_id)
LOOP
DBMS_OUTPUT.PUT_LINE('Case ' || rec.case_id || ' | ' || rec.crime || ' | ' || rec.status);
END LOOP;
END;
END CRMS_PKG;
/

BEGIN
DBMS_OUTPUT.PUT_LINE('Open cases for officer 101: ' || CRMS_PKG.get_open_case_count(101));
DBMS_OUTPUT.PUT_LINE('Age of criminal 201: ' || CRMS_PKG.get_criminal_age(201));
CRMS_PKG.list_case_criminals(3001);
CRMS_PKG.dept_report('CID');
END;
/
