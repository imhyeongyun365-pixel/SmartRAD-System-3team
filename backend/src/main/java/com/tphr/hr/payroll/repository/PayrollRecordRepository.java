package com.tphr.hr.payroll.repository;

import com.tphr.hr.payroll.entity.PayrollRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PayrollRecordRepository extends JpaRepository<PayrollRecord, Long> {
    
    // 특정 사원의 특정 귀속 연/월 급여 대장 조회
    Optional<PayrollRecord> findByEmployeeIdAndPayrollYearAndPayrollMonth(Long employeeId, Integer payrollYear, Integer payrollMonth);
    
    // 특정 귀속 연/월의 전체 사원 급여 대장 조회
    List<PayrollRecord> findByPayrollYearAndPayrollMonth(Integer payrollYear, Integer payrollMonth);
}
