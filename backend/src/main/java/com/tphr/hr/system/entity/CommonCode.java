package com.tphr.hr.system.entity;

import com.tphr.hr.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "common_code")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class CommonCode extends BaseEntity {

    @Id
    @Column(name = "code", length = 50)
    private String code; // e.g., POS_01, JOB_01

    @Column(name = "group_code", length = 50, nullable = false)
    private String groupCode; // e.g., POS, JOB

    @Column(name = "name", length = 100, nullable = false)
    private String name; // e.g., 수간호사, 방사선사

    @Column(name = "description")
    private String description;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "sort_order")
    private Integer sortOrder;
}
