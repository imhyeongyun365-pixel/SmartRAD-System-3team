package com.tphr.hr.employee.entity;

import com.tphr.hr.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "employee_health")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class EmployeeHealth extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "checkup_year", nullable = false)
    private Integer checkupYear; // 검진 년도

    @Column(name = "checkup_date")
    private LocalDate checkupDate; // 실제 검진일

    @Column(name = "tb_result", length = 20)
    private String tbResult; // 결핵 결과 (양성/음성)

    @Column(name = "hepb_result", length = 20)
    private String hepbResult; // B형간염 결과

    @Column(name = "flu_vaccine_status", length = 20)
    private String fluVaccineStatus; // 독감 접종 상태
}
