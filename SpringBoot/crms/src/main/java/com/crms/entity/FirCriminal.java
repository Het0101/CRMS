package com.crms.entity;

import com.crms.entity.keys.FirCriminalId;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "FIR_CRIMINAL")
@Data
@NoArgsConstructor
public class FirCriminal {
    @EmbeddedId
    private FirCriminalId id;

    @ManyToOne
    @MapsId("firId")
    @JoinColumn(name = "fir_id")
    private Fir fir;

    @ManyToOne
    @MapsId("criminalId")
    @JoinColumn(name = "criminal_id")
    private Criminal criminal;

    @Column(name = "role_in_crime", length = 50)
    private String roleInCrime;
}