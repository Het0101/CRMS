package com.crms.repository;

import com.crms.entity.SystemAuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuditLogRepository extends JpaRepository<SystemAuditLog, Long> {
    // JpaRepository automatically gives you findAll(), save(), etc.
}