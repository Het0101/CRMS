package com.crms.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "FIR")
@Data
@NoArgsConstructor
public class Fir {
    @Id
    @Column(name = "fir_id")
    private Long firId;

    @ManyToOne
    @JoinColumn(name = "crime_type_id")
    private CrimeType crimeType;

    @Column(name = "date_filed")
    private LocalDate dateFiled;

    @Column(name = "location", length = 150)
    private String location;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "status", length = 25)
    private String status;
}