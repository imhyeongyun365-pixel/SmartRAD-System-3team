-- 1. 부서 테이블
CREATE TABLE department (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    parent_id BIGINT NULL,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    FOREIGN KEY (parent_id) REFERENCES department(id)
);

-- 2. 공통 코드 테이블
CREATE TABLE common_code (
    code VARCHAR(50) PRIMARY KEY,
    group_code VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255) NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INT NULL,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL
);

-- 3. 사원 마스터 테이블
CREATE TABLE employee (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    emp_no VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100) NULL,
    phone VARCHAR(20) NULL,
    join_date DATE NOT NULL,
    is_shift_worker BOOLEAN NOT NULL DEFAULT FALSE,
    role VARCHAR(20) NOT NULL,
    department_id BIGINT NULL,
    position_code VARCHAR(50) NULL,
    job_category_code VARCHAR(50) NULL,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department(id),
    FOREIGN KEY (position_code) REFERENCES common_code(code),
    FOREIGN KEY (job_category_code) REFERENCES common_code(code)
);

-- 4. 사원 자격증(면허) 테이블 (1:N)
CREATE TABLE employee_license (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    license_type_code VARCHAR(50) NOT NULL,
    license_number VARCHAR(50) NOT NULL,
    issue_date DATE NULL,
    expiration_date DATE NULL,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employee(id),
    FOREIGN KEY (license_type_code) REFERENCES common_code(code)
);

-- 5. 사원 건강검진 테이블 (1:N)
CREATE TABLE employee_health (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    checkup_year INT NOT NULL,
    checkup_date DATE NULL,
    tb_result VARCHAR(20) NULL,
    hepb_result VARCHAR(20) NULL,
    flu_vaccine_status VARCHAR(20) NULL,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employee(id)
);

-- 초기 더미 데이터 세팅 (테스트용)
INSERT INTO department (name, created_at, updated_at) VALUES ('원장실', NOW(), NOW());
INSERT INTO department (name, parent_id, created_at, updated_at) VALUES ('간호본부', 1, NOW(), NOW());
INSERT INTO department (name, parent_id, created_at, updated_at) VALUES ('중환자실', 2, NOW(), NOW());
INSERT INTO department (name, parent_id, created_at, updated_at) VALUES ('응급실', 2, NOW(), NOW());

INSERT INTO common_code (code, group_code, name, created_at, updated_at) VALUES 
('POS_01', 'POS', '수석', NOW(), NOW()),
('POS_02', 'POS', '1급', NOW(), NOW()),
('POS_03', 'POS', '수간호사', NOW(), NOW()),
('JOB_01', 'JOB', '전문의', NOW(), NOW()),
('JOB_02', 'JOB', '간호사', NOW(), NOW()),
('JOB_03', 'JOB', '의료기사', NOW(), NOW()),
('LIC_01', 'LIC', '등록간호사(RN)', NOW(), NOW()),
('LIC_02', 'LIC', '의사면허(DR)', NOW(), NOW());

-- 관리자 테스트 계정 (비밀번호: 1234 의 BCrypt 형태 등 추후 Spring Security 적용 시 암호화 필요. 현재는 평문 1234 입력)
INSERT INTO employee (emp_no, name, password, email, phone, join_date, is_shift_worker, role, department_id, position_code, job_category_code, created_at, updated_at) 
VALUES ('ADMIN-001', '시스템관리자', '1234', 'admin@tphr.com', '010-1234-5678', '2026-01-01', FALSE, 'ROLE_ADMIN', 1, 'POS_01', 'JOB_01', NOW(), NOW());

INSERT INTO employee (emp_no, name, password, email, phone, join_date, is_shift_worker, role, department_id, position_code, job_category_code, created_at, updated_at) 
VALUES ('RN-1004', '김간호', '1234', 'rn1004@tphr.com', '010-1004-1004', '2026-03-01', TRUE, 'ROLE_USER', 3, 'POS_03', 'JOB_02', NOW(), NOW());
