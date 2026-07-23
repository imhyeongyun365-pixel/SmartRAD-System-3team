import { employeeMockData } from "@/data/dashboard/employeeMockData";
import type { EmployeeManagementData } from "@/types/employee";

const useMockData = process.env.USE_EMPLOYEE_MOCK_DATA !== "false";
const backendApiUrl =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || process.env.BACKEND_API_URL;

// 실제 백엔드 경로
const employeeApiPath = process.env.EMPLOYEE_API_PATH ?? "/employees";

/** 목록 조회 */
export async function getEmployeeManagementData(): Promise<EmployeeManagementData> {
  if (useMockData) {
    return employeeMockData;
  }

  if (!backendApiUrl) {
    throw new Error("BACKEND_API_URL 환경변수가 설정되지 않았습니다.");
  }

  const response = await fetch(
    new URL(employeeApiPath, backendApiUrl).toString(),
    {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`직원 목록 조회 실패: ${response.status}`);
  }

  return response.json();
}

/** 직원 등록 요청 타입 */
export interface CreateEmployeeRequest {
  empNo: string;
  name: string;
  email?: string;
  phone?: string;
  joinDate: string;
  isShiftWorker?: boolean;
  gender?: string;
  birthDate?: string;
  address?: string;
  internalPhone?: string;
  emergencyContact?: string;
  emergencyRelation?: string;
  departmentId: number;
  positionCode?: string;
  jobCategoryCode?: string;
  employmentTypeCode?: string;
  hireRouteCode?: string;
  workTypeCode?: string;
  workWard?: string;
  payStep?: number;
  payrollTypeCode?: string;
  payrollDate?: number;
  bankAccount?: string;
  taxTypeCode?: string;
  roleGroupId?: number;
}

/** 직원 등록 */
export async function createEmployee(
  payload: CreateEmployeeRequest,
): Promise<{ id: number; empNo?: string }> {
  if (!backendApiUrl) {
    throw new Error("BACKEND_API_URL 환경변수가 설정되지 않았습니다.");
  }

  const response = await fetch(
    new URL("/employees", backendApiUrl).toString(),
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`직원 등록 실패 (${response.status}): ${text}`);
  }

  return response.json();
}
