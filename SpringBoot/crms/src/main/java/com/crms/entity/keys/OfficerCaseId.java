package com.crms.entity.keys;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@EqualsAndHashCode
public class OfficerCaseId implements Serializable {
    @Column(name = "officer_id")
    private Long officerId;

    @Column(name = "case_id")
    private Long caseId;
}