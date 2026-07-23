import type { Metadata } from "next";
import EmployeeCreatePage from "@/component/dashboard/EmployeePage/EmployeeCreatePage";

export const metadata: Metadata = {
  title: "직원 추가 | SmartRAD HR",
};

export default function EmployeeCreateRoutePage() {
  return <EmployeeCreatePage />;
}
