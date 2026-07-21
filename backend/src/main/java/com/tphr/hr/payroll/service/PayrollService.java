package com.tphr.hr.payroll.service;

import com.tphr.hr.employee.entity.Employee;
import com.tphr.hr.employee.repository.EmployeeRepository;
import com.tphr.hr.payroll.dto.PayrollDto;
import com.tphr.hr.payroll.entity.PayrollDetail;
import com.tphr.hr.payroll.entity.PayrollRecord;
import com.tphr.hr.payroll.repository.PayrollDetailRepository;
import com.tphr.hr.payroll.repository.PayrollRecordRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PayrollService {

    private final PayrollRecordRepository payrollRecordRepository;
    private final PayrollDetailRepository payrollDetailRepository;
    private final EmployeeRepository employeeRepository;

    // 가상의 공제율 (실무에서는 DB 관리)
    private static final BigDecimal NATIONAL_PENSION_RATE = new BigDecimal("0.045"); // 국민연금 4.5%
    private static final BigDecimal HEALTH_INSURANCE_RATE = new BigDecimal("0.03545"); // 건강보험 3.545%

    /**
     * 특정 연/월의 전 직원 급여를 자동 계산하여 저장합니다.
     */
    @Transactional
    public List<PayrollDto.Response> calculatePayroll(Integer year, Integer month) {
        log.info("Starting payroll calculation for {}/{}", year, month);
        List<Employee> activeEmployees = employeeRepository.findByAccountStatus("ACTIVE");
        List<PayrollRecord> calculatedRecords = new ArrayList<>();

        for (Employee employee : activeEmployees) {
            // 이미 계산된 급여가 있다면 삭제 후 재계산
            payrollRecordRepository.findByEmployeeIdAndPayrollYearAndPayrollMonth(employee.getId(), year, month)
                    .ifPresent(existingRecord -> {
                        payrollDetailRepository.deleteByPayrollRecordId(existingRecord.getId());
                        payrollRecordRepository.delete(existingRecord);
                        payrollRecordRepository.flush(); // 즉시 반영
                    });

            // 1. 기본급 (실무에서는 직급/호봉 테이블 연동)
            BigDecimal baseSalary = new BigDecimal("3000000"); // 임의의 기본급 300만원

            // 2. 수당 계산 (야간/휴일 등)
            BigDecimal nightAllowance = new BigDecimal("150000");
            BigDecimal totalAllowance = nightAllowance;

            // 3. 공제 계산 (4대보험)
            BigDecimal grossSalary = baseSalary.add(totalAllowance);
            BigDecimal nationalPension = grossSalary.multiply(NATIONAL_PENSION_RATE).setScale(0, RoundingMode.HALF_UP);
            BigDecimal healthInsurance = grossSalary.multiply(HEALTH_INSURANCE_RATE).setScale(0, RoundingMode.HALF_UP);
            BigDecimal totalDeduction = nationalPension.add(healthInsurance);

            // 4. 실지급액
            BigDecimal netPay = grossSalary.subtract(totalDeduction);

            // 5. 마스터(Record) 저장
            PayrollRecord record = PayrollRecord.builder()
                    .employee(employee)
                    .payrollYear(year)
                    .payrollMonth(month)
                    .baseSalary(baseSalary)
                    .totalAllowance(totalAllowance)
                    .totalDeduction(totalDeduction)
                    .netPay(netPay)
                    .status("PENDING")
                    .build();
            
            PayrollRecord savedRecord = payrollRecordRepository.save(record);
            calculatedRecords.add(savedRecord);

            // 6. 상세(Detail) 저장
            List<PayrollDetail> details = List.of(
                    PayrollDetail.builder().payrollRecord(savedRecord).itemType("ALLOWANCE").itemName("야간수당").amount(nightAllowance).build(),
                    PayrollDetail.builder().payrollRecord(savedRecord).itemType("DEDUCTION").itemName("국민연금").amount(nationalPension).build(),
                    PayrollDetail.builder().payrollRecord(savedRecord).itemType("DEDUCTION").itemName("건강보험").amount(healthInsurance).build()
            );
            payrollDetailRepository.saveAll(details);
        }

        return calculatedRecords.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    /**
     * 급여 대장을 마감(확정) 처리합니다.
     */
    @Transactional
    public PayrollDto.Response confirmPayroll(Long recordId) {
        PayrollRecord record = payrollRecordRepository.findById(recordId)
                .orElseThrow(() -> new IllegalArgumentException("Payroll record not found"));
        
        record.confirm(); // 상태 변경 (JPA 더티 체킹으로 자동 업데이트됨)
        
        return mapToResponse(record);
    }

    /**
     * 특정 사원의 급여 명세서 상세 조회
     */
    @Transactional(readOnly = true)
    public PayrollDto.RecordWithDetailsResponse getPayrollDetails(Long employeeId, Integer year, Integer month) {
        PayrollRecord record = payrollRecordRepository.findByEmployeeIdAndPayrollYearAndPayrollMonth(employeeId, year, month)
                .orElseThrow(() -> new IllegalArgumentException("Payroll record not found"));

        List<PayrollDetail> details = payrollDetailRepository.findByPayrollRecordId(record.getId());

        List<PayrollDto.DetailResponse> detailResponses = details.stream()
                .map(d -> PayrollDto.DetailResponse.builder()
                        .id(d.getId())
                        .itemType(d.getItemType())
                        .itemName(d.getItemName())
                        .amount(d.getAmount())
                        .build())
                .collect(Collectors.toList());

        return PayrollDto.RecordWithDetailsResponse.builder()
                .record(mapToResponse(record))
                .details(detailResponses)
                .build();
    }

    private PayrollDto.Response mapToResponse(PayrollRecord record) {
        return PayrollDto.Response.builder()
                .id(record.getId())
                .employeeId(record.getEmployee().getId())
                .employeeName(record.getEmployee().getName())
                .payrollYear(record.getPayrollYear())
                .payrollMonth(record.getPayrollMonth())
                .baseSalary(record.getBaseSalary())
                .totalAllowance(record.getTotalAllowance())
                .totalDeduction(record.getTotalDeduction())
                .netPay(record.getNetPay())
                .status(record.getStatus())
                .build();
    }
}
