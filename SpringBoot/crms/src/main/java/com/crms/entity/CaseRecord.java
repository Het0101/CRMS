package com.crms.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "CASE_RECORD")
@Data
@NoArgsConstructor
public class CaseRecord {
    @Id
    @Column(name = "case_id")
    private Long caseId;

    @ManyToOne
    @JoinColumn(name = "fir_id")
    private Fir fir;

    @Column(name = "status", length = 20)
    private String status;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "close_date")
    private LocalDate closeDate;
}