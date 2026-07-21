package com.tphr.hr.payroll.repository;

import com.tphr.hr.payroll.entity.PayrollDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PayrollDetailRepository extends JpaRepository<PayrollDetail, Long> {
    
    // 특정 급여 대장의 세부 내역 조회
    List<PayrollDetail> findByPayrollRecordId(Long payrollRecordId);
    
    // 특정 급여 대장의 기존 세부 내역 모두 삭제 (재계산 시 사용)
    void deleteByPayrollRecordId(Long payrollRecordId);
}
