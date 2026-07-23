import type { Metadata } from "next";
import AttendanceLinkPage from "@/component/dashboard/AttendanceLinkPage/AttendanceLinkPage";

export const metadata: Metadata = {
  title: "근태 연동 | SmartRAD HR",
  description: "SmartRAD HR 근태 연동",
};

export default function AttendanceLinkRoutePage() {
  return <AttendanceLinkPage />;
}
