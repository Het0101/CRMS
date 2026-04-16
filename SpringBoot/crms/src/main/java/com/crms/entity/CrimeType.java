package com.crms.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "CRIME_TYPE")
@Data
@NoArgsConstructor
public class CrimeType {
    @Id
    @Column(name = "crime_type_id")
    private Long crimeTypeId;

    @Column(name = "description", nullable = false, unique = true, length = 80)
    private String description;
}