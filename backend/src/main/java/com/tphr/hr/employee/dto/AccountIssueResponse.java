package com.tphr.hr.employee.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AccountIssueResponse {
    private Long id;
    private String empNo;
    private String newPassword;
}
