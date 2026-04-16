package com.crms.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "EVIDENCE")
@Data
@NoArgsConstructor
public class Evidence {
    @Id
    @Column(name = "evidence_id")
    private Long evidenceId;

    @ManyToOne
    @JoinColumn(name = "case_id")
    private CaseRecord caseRecord;

    @ManyToOne
    @JoinColumn(name = "officer_id")
    private Officer officer;

    @Column(name = "type", length = 20)
    private String type;

    @Column(name = "description", length = 255)
    private String description;

    @Column(name = "evidence_date")
    private LocalDate evidenceDate;
}