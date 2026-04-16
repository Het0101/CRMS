package com.crms.entity;

import com.crms.entity.keys.OfficerCaseId;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "OFFICER_CASE")
@Data
@NoArgsConstructor
public class OfficerCase {
    @EmbeddedId
    private OfficerCaseId id;

    @ManyToOne
    @MapsId("officerId")
    @JoinColumn(name = "officer_id")
    private Officer officer;

    @ManyToOne
    @MapsId("caseId")
    @JoinColumn(name = "case_id")
    private CaseRecord caseRecord;

    @Column(name = "assignment_date")
    private LocalDate assignmentDate;

    @Column(name = "role", length = 50)
    private String role;

    @Column(name = "is_lead", length = 1)
    private String isLead;
}