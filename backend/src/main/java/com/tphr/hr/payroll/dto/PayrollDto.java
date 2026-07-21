package com.tphr.hr.payroll.dto;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.List;

public class PayrollDto {

    @Getter
    @Builder
    public static class Response {
        private Long id;
        private Long employeeId;
        private String employeeName;
        private Integer payrollYear;
        private Integer payrollMonth;
        private BigDecimal baseSalary;
        private BigDecimal totalAllowance;
        private BigDecimal totalDeduction;
        private BigDecimal netPay;
        private String status;
    }

    @Getter
    @Builder
    public static class DetailResponse {
        private Long id;
        private String itemType; // ALLOWANCE or DEDUCTION
        private String itemName;
        private BigDecimal amount;
    }

    @Getter
    @Builder
    public static class RecordWithDetailsResponse {
        private Response record;
        private List<DetailResponse> details;
    }
}
