package com.crms.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "OFFICER")
@Data
@NoArgsConstructor
public class Officer {
    @Id
    @Column(name = "officer_id")
    private Long officerId;

    @Column(name = "name", nullable = false, length = 80)
    private String name;

    @Column(name = "rank", nullable = false, length = 30)
    private String rank;

    @Column(name = "department", nullable = false, length = 60)
    private String department;

    @Column(name = "badge_no", unique = true, length = 15)
    private String badgeNo;

    @Column(name = "phone", length = 15)
    private String phone;

    @Column(name = "email", length = 80)
    private String email;

    @Column(name = "join_date")
    private LocalDate joinDate;
}