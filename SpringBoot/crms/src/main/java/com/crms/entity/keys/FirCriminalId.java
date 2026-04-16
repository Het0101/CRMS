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
public class FirCriminalId implements Serializable {
    @Column(name = "fir_id")
    private Long firId;

    @Column(name = "criminal_id")
    private Long criminalId;
}