import type { Metadata } from "next";
import AppointmentPage from "@/component/dashboard/AppointmentPage/AppointmentPage";

export const metadata: Metadata = {
  title: "인사발령 관리 | SmartRAD HR",
  description: "SmartRAD HR 인사발령 관리",
};

export default function AppointmentRoutePage() {
  return <AppointmentPage />;
}
