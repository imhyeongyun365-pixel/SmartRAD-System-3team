import type { Metadata } from "next";
import OrganizationPage from "@/component/dashboard/OrganizationPage/OrganizationPage";

export const metadata: Metadata = {
  title: "조직관리 | SmartRAD HR",
  description: "SmartRAD HR 조직 관리",
};

export default function OrganizationRoutePage() {
  return <OrganizationPage />;
}
