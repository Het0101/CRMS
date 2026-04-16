package com.crms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import com.crms.entity.CaseRecord;

public interface PlSqlRepository extends JpaRepository<CaseRecord, Long> {

    @Modifying
    @Transactional
    @Query(value = "CALL assign_officer(:p_officer_id, :p_case_id, :p_role, :p_is_lead)", nativeQuery = true)
    void callAssignOfficer(@Param("p_officer_id") Long officerId, @Param("p_case_id") Long caseId, @Param("p_role") String role, @Param("p_is_lead") String isLead);

    @Modifying
    @Transactional
    @Query(value = "CALL close_case(:p_case_id, :p_days_open)", nativeQuery = true)
    void callCloseCase(@Param("p_case_id") Long caseId, @Param("p_days_open") Integer daysOpen);

    @Query(value = "SELECT CRMS_PKG.get_open_case_count(:p_officer_id) FROM DUAL", nativeQuery = true)
    Integer callGetOpenCaseCount(@Param("p_officer_id") Long officerId);
}