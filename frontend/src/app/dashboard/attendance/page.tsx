import type { Metadata } from "next";
import AttendancePage from "@/component/dashboard/AttendancePage/AttendancePage";

export const metadata: Metadata = {
  title: "출퇴근 관리 | SmartRAD HR",
  description: "SmartRAD HR 출퇴근 관리",
};

export default function AttendanceRoutePage() {
  return <AttendancePage />;
}
