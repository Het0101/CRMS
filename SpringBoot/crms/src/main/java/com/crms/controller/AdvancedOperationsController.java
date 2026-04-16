package com.crms.controller;

import com.crms.repository.AdvancedQueryRepository;
import com.crms.repository.PlSqlRepository;
import com.crms.repository.AuditLogRepository; // 1. Import the new repo
import com.crms.entity.SystemAuditLog;         // 2. Import the entity

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/advanced")
@CrossOrigin(origins = "*")
public class AdvancedOperationsController {

    @Autowired
    private AdvancedQueryRepository advancedRepo;

    @Autowired
    private PlSqlRepository plSqlRepo;

    // 3. Inject your new AuditLogRepository
    @Autowired
    private AuditLogRepository auditRepo;

    // --- RUBRIC: ADVANCED SQL ---

    @GetMapping("/active-cases-view")
    public List<Map<String, Object>> getActiveCasesView() {
        return advancedRepo.getActiveCasesView();
    }

    @GetMapping("/departments-multiple-officers")
    public List<Map<String, Object>> getDepartmentsWithMultipleOfficers() {
        return advancedRepo.getDepartmentsWithMultipleOfficers();
    }

    @GetMapping("/unarrested-criminals")
    public List<Long> getUnarrestedFirCriminals() {
        return advancedRepo.getUnarrestedFirCriminals();
    }

    // --- RUBRIC: PL/SQL ---

    @PostMapping("/cases/assign-officer")
    public void assignOfficer(
            @RequestParam Long officerId,
            @RequestParam Long caseId,
            @RequestParam String role,
            @RequestParam String isLead) {
        plSqlRepo.callAssignOfficer(officerId, caseId, role, isLead);
    }

    @PostMapping("/cases/{id}/close")
    public void closeCase(
            @PathVariable Long id,
            @RequestParam Integer daysOpen) {
        plSqlRepo.callCloseCase(id, daysOpen);
    }

    @GetMapping("/officers/{id}/open-case-count")
    public Integer getOpenCaseCount(@PathVariable Long id) {
        return plSqlRepo.callGetOpenCaseCount(id);
    }

    // --- SECURITY: AUDIT LOG ---

    // 4. Add the endpoint to fetch the logs for the React UI
    @GetMapping("/audit-logs")
    public List<SystemAuditLog> getAuditLogs() {
        return auditRepo.findAll();
    }
}