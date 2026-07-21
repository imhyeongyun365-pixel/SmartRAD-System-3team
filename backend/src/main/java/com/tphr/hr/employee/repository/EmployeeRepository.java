package com.tphr.hr.employee.repository;

import com.tphr.hr.employee.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    
    // 현재 활성화된(재직 중인) 직원 목록 조회 (퇴사/잠금 계정 제외)
    List<Employee> findByAccountStatus(String accountStatus);
}
