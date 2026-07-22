import { employeeMockData } from "@/data/dashboard/employeeMockData";
import type { EmployeeManagementData } from "@/types/employee";

const useMockData = process.env.USE_EMPLOYEE_MOCK_DATA !== "false";
const backendApiUrl = process.env.BACKEND_API_URL;
const employeeApiPath = process.env.EMPLOYEE_API_PATH ?? "/api/v1/employees";

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
