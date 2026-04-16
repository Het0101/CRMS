package com.crms.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "SYSTEM_AUDIT_LOG")
@Data
@NoArgsConstructor
public class SystemAuditLog {
    @Id
    @Column(name = "audit_id")
    private Long auditId;

    @Column(name = "target_table")
    private String targetTable;

    @Column(name = "record_id")
    private Long recordId;

    @Column(name = "action_type")
    private String actionType;

    @Column(name = "old_value")
    private String oldValue;

    @Column(name = "new_value")
    private String newValue;

    // Fixed the column mapping to avoid the reserved keyword!
    @Column(name = "audit_timestamp")
    private LocalDateTime timestamp;
}