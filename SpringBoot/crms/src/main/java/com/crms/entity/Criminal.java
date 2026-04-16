package com.crms.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "CRIMINAL")
@Data
@NoArgsConstructor
public class Criminal {
    @Id
    @Column(name = "criminal_id")
    private Long criminalId;

    @Column(name = "name", nullable = false, length = 80)
    private String name;

    @Column(name = "dob")
    private LocalDate dob;

    @Column(name = "gender", length = 1)
    private String gender;

    @Column(name = "address", length = 200)
    private String address;

    // CRITICAL REQUIREMENT: Maps DB id_proof_no to frontend nationalId
    @Column(name = "id_proof_no", unique = true, length = 20)
    @JsonProperty("nationalId")
    private String idProofNo;

    @Column(name = "status", length = 20)
    private String status;
}