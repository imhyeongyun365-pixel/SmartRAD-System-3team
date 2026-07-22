package com.tphr.hr.system.auth.security;

import com.tphr.hr.employee.entity.Employee;
import com.tphr.hr.employee.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final EmployeeRepository employeeRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // username 파라미터로 empNo(사번)이 전달됨
        Employee employee = employeeRepository.findByEmpNo(username)
                .orElseThrow(() -> new UsernameNotFoundException("해당 사번의 사용자를 찾을 수 없습니다: " + username));
        
        return new CustomUserDetails(employee);
    }
}
