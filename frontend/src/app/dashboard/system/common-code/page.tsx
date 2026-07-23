import type { Metadata } from "next";

import CommonCodePage from "@/component/dashboard/CommonCodePage/CommonCodePage";
import { getDashboardData } from "@/services/dashboardService";

export const metadata: Metadata = {
  title: "공통코드 관리 | SmartRAD HR",
  description: "SmartRAD HR 시스템 공통코드 관리",
};

export default async function CommonCodeRoutePage() {
  const initialData = await getDashboardData();
  return <CommonCodePage initialData={initialData} />;
}
