package com.crms.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "COURT_HEARING")
@Data
@NoArgsConstructor
public class CourtHearing {
    @Id
    @Column(name = "hearing_id")
    private Long hearingId;

    @ManyToOne
    @JoinColumn(name = "case_id")
    private CaseRecord caseRecord;

    @Column(name = "hearing_date")
    private LocalDate hearingDate;

    @Column(name = "status", length = 20)
    private String status;

    @Column(name = "remarks", length = 255)
    private String remarks;
}