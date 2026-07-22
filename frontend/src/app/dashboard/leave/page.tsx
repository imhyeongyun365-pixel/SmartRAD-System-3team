import type { Metadata } from "next";
import LeavePage from "@/component/dashboard/LeavePage/LeavePage";

export const metadata: Metadata = {
  title: "휴가 관리 | SmartRAD HR",
  description: "SmartRAD HR 휴가 관리",
};

export default function LeaveRoutePage() {
  return <LeavePage />;
}
