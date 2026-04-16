package com.crms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.crms.entity.CaseRecord;
import java.util.List;
import java.util.Map;

public interface AdvancedQueryRepository extends JpaRepository<CaseRecord, Long> {

    // View Integration
    @Query(value = "SELECT * FROM active_case_view", nativeQuery = true)
    List<Map<String, Object>> getActiveCasesView();

    // Group By + Having
    @Query(value = "SELECT department, COUNT(officer_id) AS officer_count FROM OFFICER GROUP BY department HAVING COUNT(officer_id) > 1", nativeQuery = true)
    List<Map<String, Object>> getDepartmentsWithMultipleOfficers();

    // MINUS Operator
    @Query(value = "SELECT criminal_id FROM FIR_CRIMINAL MINUS SELECT criminal_id FROM CRIMINAL WHERE status = 'Arrested'", nativeQuery = true)
    List<Long> getUnarrestedFirCriminals();
}