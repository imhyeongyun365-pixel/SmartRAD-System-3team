"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import styles from "./DashboardSidebar.module.scss";

type SidebarIconName =
  | "dashboard"
  | "approval"
  | "employee"
  | "payroll"
  | "system";

interface SidebarIconProps {
  name: SidebarIconName;
}

function SidebarIcon({ name }: SidebarIconProps) {
  if (name === "dashboard") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="4" width="6" height="6" rx="1" />
        <rect x="14" y="4" width="6" height="6" rx="1" />
        <rect x="4" y="14" width="6" height="6" rx="1" />
        <rect x="14" y="14" width="6" height="6" rx="1" />
      </svg>
    );
  }

  if (name === "approval") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 3h8l4 4v14H7z" />
        <path d="M15 3v5h4" />
        <path d="M10 12h6M10 16h6" />
      </svg>
    );
  }

  if (name === "employee") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 19c.5-4 2.5-6 5.5-6s5 2 5.5 6" />
        <circle cx="17" cy="9" r="2" />
        <path d="M15.5 14.5c3 .2 4.5 1.8 5 4.5" />
      </svg>
    );
  }

  if (name === "payroll") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 9h18" />
        <path d="M7 14h4" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2" />
      <path d="m5.6 5.6 1.5 1.5M16.9 16.9l1.5 1.5" />
      <path d="m18.4 5.6-1.5 1.5M7.1 16.9l-1.5 1.5" />
    </svg>
  );
}

export default function DashboardSidebar() {
  const pathname = usePathname();

  // 1. 먼저 각 페이지 여부 계산
  const isDashboardPage = pathname === "/dashboard";
  const isApprovalInboxPage = pathname.startsWith("/dashboard/approvals");
  const isDraftDocumentsPage = pathname.startsWith("/dashboard/drafts");
  const isEmployeePage = pathname.startsWith("/dashboard/employees");
  const isOrganizationPage = pathname.startsWith("/dashboard/organization"); // ← 여기
  const isAppointmentPage = pathname.startsWith("/dashboard/appointments");
  const isDutyPage = pathname.startsWith("/dashboard/duty");
  const isAttendanceLinkPage = pathname.startsWith(
    "/dashboard/attendance-link",
  );
  const isAttendancePage =
    pathname.startsWith("/dashboard/attendance") &&
    !pathname.startsWith("/dashboard/attendance-link");
  const isLeavePage = pathname.startsWith("/dashboard/leave");

  // 2. 그 다음에 조합해서 사용
  const isApprovalRoute = isApprovalInboxPage || isDraftDocumentsPage;
  const isEmployeeRoute =
    isEmployeePage ||
    isOrganizationPage ||
    isAppointmentPage ||
    isDutyPage ||
    isAttendancePage ||
    isAttendanceLinkPage; // ← 이제 사용 가능

  // 3. state
  const [isApprovalOpen, setIsApprovalOpen] = useState(isApprovalRoute);
  const [isEmployeeOpen, setIsEmployeeOpen] = useState(isEmployeeRoute);

  // 결재 대기함 또는 기안 문서함에 들어가면 자동으로 펼침
  useEffect(() => {
    setIsApprovalOpen(isApprovalRoute);
  }, [isApprovalRoute]);

  useEffect(() => {
    setIsEmployeeOpen(isEmployeeRoute);
  }, [isEmployeeRoute]);

  return (
    <aside className={styles.sidebar}>
      <Link href="/" className={styles.brand}>
        <span className={styles.brandSymbol}>＋</span>

        <span className={styles.brandText}>
          <strong>SmartRAD HR</strong>
          <small>Hospital Human Resources</small>
        </span>
      </Link>

      <nav className={styles.sideNav}>
        <p className={styles.menuTitle}>MAIN MENU</p>

        {/* 대시보드 */}
        <Link
          href="/dashboard"
          className={`${styles.sideLink} ${
            isDashboardPage ? styles.active : ""
          }`}
          aria-current={isDashboardPage ? "page" : undefined}
        >
          <span className={styles.iconBox}>
            <SidebarIcon name="dashboard" />
          </span>

          <span className={styles.menuLabel}>대시보드</span>
        </Link>

        {/* 전자결재 */}
        <div className={styles.menuGroup}>
          <button
            type="button"
            className={`${styles.sideLink} ${
              isApprovalRoute || isApprovalOpen ? styles.groupActive : ""
            }`}
            onClick={() => setIsApprovalOpen((previous) => !previous)}
            aria-expanded={isApprovalOpen}
            aria-controls="electronic-approval-submenu"
          >
            <span className={styles.iconBox}>
              <SidebarIcon name="approval" />
            </span>

            <span className={styles.menuLabel}>전자결재</span>

            <span
              className={`${styles.arrow} ${
                isApprovalOpen ? styles.arrowOpen : ""
              }`}
              aria-hidden="true"
            >
              ⌄
            </span>
          </button>

          <div
            id="electronic-approval-submenu"
            className={`${styles.subMenu} ${
              isApprovalOpen ? styles.subMenuOpen : ""
            }`}
          >
            <Link
              href="/dashboard/approvals"
              className={isApprovalInboxPage ? styles.subMenuActive : ""}
              aria-current={isApprovalInboxPage ? "page" : undefined}
            >
              결재 대기함
            </Link>

            <Link
              href="/dashboard/drafts"
              className={isDraftDocumentsPage ? styles.subMenuActive : ""}
              aria-current={isDraftDocumentsPage ? "page" : undefined}
            >
              기안 문서함
            </Link>
          </div>
        </div>

        {/* 인사관리 */}
        <div className={styles.menuGroup}>
          <button
            type="button"
            className={`${styles.sideLink} ${
              isEmployeeRoute || isEmployeeOpen ? styles.groupActive : ""
            }`}
            onClick={() => setIsEmployeeOpen((prev) => !prev)}
            aria-expanded={isEmployeeOpen}
          >
            <span className={styles.iconBox}>
              <SidebarIcon name="employee" />
            </span>
            <span className={styles.menuLabel}>인사관리</span>
            <span
              className={`${styles.arrow} ${isEmployeeOpen ? styles.arrowOpen : ""}`}
              aria-hidden="true"
            >
              ⌄
            </span>
          </button>

          <div
            className={`${styles.subMenu} ${isEmployeeOpen ? styles.subMenuOpen : ""}`}
          >
            <Link
              href="/dashboard/employees"
              className={isEmployeePage ? styles.subMenuActive : ""}
              aria-current={isEmployeePage ? "page" : undefined}
            >
              직원관리
            </Link>

            <Link
              href="/dashboard/organization"
              className={isOrganizationPage ? styles.subMenuActive : ""}
              aria-current={isOrganizationPage ? "page" : undefined}
            >
              조직관리
            </Link>

            <Link
              href="/dashboard/appointments"
              className={isAppointmentPage ? styles.subMenuActive : ""}
              aria-current={isAppointmentPage ? "page" : undefined}
            >
              인사발령 관리
            </Link>

            <Link
              href="/dashboard/duty"
              className={isDutyPage ? styles.subMenuActive : ""}
              aria-current={isDutyPage ? "page" : undefined}
            >
              듀티표 편성
            </Link>

            <Link
              href="/dashboard/attendance"
              className={isAttendancePage ? styles.subMenuActive : ""}
              aria-current={isAttendancePage ? "page" : undefined}
            >
              출퇴근 관리
            </Link>

            <Link
              href="/dashboard/attendance-link"
              className={isAttendanceLinkPage ? styles.subMenuActive : ""}
            >
              근태 연동
            </Link>

            <Link
              href="/dashboard/leave"
              className={isLeavePage ? styles.subMenuActive : ""}
            >
              휴가 관리
            </Link>
          </div>
        </div>

        {/* 급여관리 */}
        <button type="button" className={styles.sideLink}>
          <span className={styles.iconBox}>
            <SidebarIcon name="payroll" />
          </span>

          <span className={styles.menuLabel}>급여관리</span>
          <span className={styles.arrow}>⌄</span>
        </button>

        <p className={`${styles.menuTitle} ${styles.adminTitle}`}>ADMIN</p>

        {/* 시스템 관리 */}
        <button type="button" className={styles.sideLink}>
          <span className={styles.iconBox}>
            <SidebarIcon name="system" />
          </span>

          <span className={styles.menuLabel}>시스템 관리</span>
          <span className={styles.arrow}>⌄</span>
        </button>
      </nav>
    </aside>
  );
}
