import type { Metadata } from "next";
import DutyPage from "@/component/dashboard/DutyPage/DutyPage";

export const metadata: Metadata = {
  title: "듀티표 편성 | SmartRAD HR",
  description: "SmartRAD HR 듀티표 편성",
};

export default function DutyRoutePage() {
  return <DutyPage />;
}
