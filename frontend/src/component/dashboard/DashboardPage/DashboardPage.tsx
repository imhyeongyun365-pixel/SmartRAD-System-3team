"use client";

import DashboardSidebar from "../DashboardSidebar/DashboardSidebar";
import styles from "./DashboardPage.module.scss";
import { useState, useEffect } from "react";

const summaryCards = [
  {
    label: "전체 직원",
    value: "2,184",
    unit: "명",
    status: "+2.1%",
    statusType: "up",
    icon: "people",
  },
  {
    label: "금일 출근",
    value: "1,942",
    unit: "명",
    status: "정상",
    statusType: "good",
    icon: "check",
  },
  {
    label: "휴가 중",
    value: "18",
    unit: "명",
    status: "보통",
    statusType: "normal",
    icon: "calendar",
  },
  {
    label: "결재 대기",
    value: "76",
    unit: "건",
    status: "48건",
    statusType: "warn",
    icon: "document",
  },
];

const approvalItems = [
  { text: "연차 휴가 신청서 5건", color: "red", badge: "긴급" },
  { text: "인사발령 요청서 3건", color: "yellow", badge: "대기" },
  { text: "교육비 지원신청 2건", color: "blue", badge: "일반" },
  { text: "복리후생 신청 1건", color: "green", badge: "일반" },
];

const attendanceList = [
  {
    name: "박서준",
    dept: "영상의학과",
    time: "07:52",
    status: "정상",
    statusType: "good",
  },
  {
    name: "최유진",
    dept: "진단검사과",
    time: "Working",
    status: "근무중",
    statusType: "working",
  },
  {
    name: "이도현",
    dept: "영양팀",
    time: "09:17",
    status: "지각",
    statusType: "late",
  },
  {
    name: "강민서",
    dept: "Day",
    time: "Off",
    status: "휴무",
    statusType: "off",
  },
];

const notices = [
  { title: "2026년 하반기 정기 인사 이동 안내", date: "2026.07.10" },
  { title: "여름 휴가철 대체 근무자 등록 요청", date: "2026.07.08" },
  { title: "직원 건강검진 일정 사전 안내", date: "2026.07.05" },
];

const myApprovals = [
  {
    title: "워크샵 구매 품의서",
    author: "이지수",
    date: "2026.07.11",
    status: "대기중",
    statusType: "wait",
  },
  {
    title: "진단시약 인수증 발행",
    author: "박성호",
    date: "2026.07.10",
    status: "승인",
    statusType: "approve",
  },
  {
    title: "회의수가 개정 내부 검토",
    author: "김하은",
    date: "2026.07.09",
    status: "대기중",
    statusType: "wait",
  },
  {
    title: "신규 인원 근무표 개편",
    author: "최준혁",
    date: "2026.07.08",
    status: "반려",
    statusType: "reject",
  },
];

export default function DashboardPage() {
  const [todayText, setTodayText] = useState("");

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();

      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const date = now.getDate();

      const week = ["일", "월", "화", "수", "목", "금", "토"];
      const day = week[now.getDay()];

      setTodayText(`${year}년 ${month}월 ${date}일 ${day}요일`);
    };

    updateDate(); // 처음 한 번 실행

    // 자정이 지나면 자동으로 날짜가 바뀌도록 (선택사항)
    const timer = setInterval(updateDate, 60 * 1000); // 1분마다 체크

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.dashboard}>
      <DashboardSidebar />

      <div className={styles.pageArea}>
        <header className={styles.topHeader}>
          <label className={styles.search}>
            <span>⌕</span>
            <input type="search" placeholder="직원, 부서, 문서를 검색하세요" />
          </label>

          <div className={styles.profile}>
            <span>김</span>
            <div>
              <strong>김관리</strong>
              <small>인사팀 · 관리자</small>
            </div>
          </div>
        </header>

        <main className={styles.main}>
          {/* 인사말 */}
          <section className={styles.welcome}>
            <div>
              <h1>좋은 아침입니다, 김관리자님 👋</h1>
              <p>
                오늘도 원내 인사 현황을 빠르게 확인하고, 처리가 필요한 업무를
                챙겨보세요.
              </p>
            </div>
            <div className={styles.today}>
              <small>오늘</small>
              <strong>{todayText || "날짜 불러오는 중..."}</strong>
            </div>
          </section>

          {/* 요약 카드 */}
          <section className={styles.summaryGrid}>
            {summaryCards.map((card) => (
              <article key={card.label} className={styles.summaryCard}>
                <div className={styles.summaryTop}>
                  <span
                    className={`${styles.summaryIcon} ${styles[card.icon]}`}
                  >
                    {card.icon === "people" && "👥"}
                    {card.icon === "check" && "✓"}
                    {card.icon === "calendar" && "📅"}
                    {card.icon === "document" && "📄"}
                  </span>
                  <em className={styles[card.statusType]}>{card.status}</em>
                </div>
                <p>{card.label}</p>
                <h2>
                  {card.value}
                  <small>{card.unit}</small>
                </h2>
              </article>
            ))}
          </section>

          {/* 중간 영역 */}
          <section className={styles.middleGrid}>
            <article className={styles.panel}>
              <div className={styles.panelTitle}>
                <h2>월별 근태 현황</h2>
                <span>● 정상 출근율</span>
              </div>
              <div className={styles.lineChart}>
                <svg
                  viewBox="0 0 700 190"
                  preserveAspectRatio="none" // ← 이 속성 추가 (핵심)
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="#3a7bff"
                        stopOpacity="0.25"
                      />
                      <stop offset="100%" stopColor="#3a7bff" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* 영역 채우기 */}
                  <path
                    d="M0 145 L70 125 L140 135 L210 95 L280 105 L350 70 L420 85 L490 48 L560 62 L630 36 L700 52 L700 190 L0 190 Z"
                    fill="url(#chartFill)"
                  />

                  {/* 선 */}
                  <path
                    d="M0 145 L70 125 L140 135 L210 95 L280 105 L350 70 L420 85 L490 48 L560 62 L630 36 L700 52"
                    fill="none"
                    stroke="#2864ef"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke" // 선 두께가 늘어나지 않게
                  />

                  {/* 포인트 */}
                  <circle cx="490" cy="48" r="6" fill="#2864ef" />
                </svg>
              </div>
            </article>

            <article className={styles.panel}>
              <div className={styles.panelTitle}>
                <h2>결재 대기 안건</h2>
                <a href="#approval">전체보기 ›</a>
              </div>
              <ul className={styles.approvalList}>
                {approvalItems.map((item) => (
                  <li key={item.text}>
                    <span className={`${styles.dot} ${styles[item.color]}`} />
                    <span className={styles.approvalText}>{item.text}</span>
                    <em className={`${styles.badge} ${styles[item.color]}`}>
                      {item.badge}
                    </em>
                  </li>
                ))}
              </ul>
            </article>
          </section>

          {/* 하단 4개 패널 */}
          <section className={styles.bottomGrid}>
            {/* 오늘의 근무 현황 */}
            <article className={styles.panel}>
              <div className={styles.panelTitle}>
                <h2>오늘의 근무 현황</h2>
                <a href="#attendance">전체보기 ›</a>
              </div>
              <div className={styles.attendanceTable}>
                <div className={styles.tableHead}>
                  <span>이름</span>
                  <span>부서</span>
                  <span>출근</span>
                  <span>상태</span>
                </div>
                {attendanceList.map((row) => (
                  <div key={row.name} className={styles.tableRow}>
                    <div className={styles.nameCell}>
                      <span className={styles.avatar}>{row.name[0]}</span>
                      {row.name}
                    </div>
                    <span>{row.dept}</span>
                    <span>{row.time}</span>
                    <em
                      className={`${styles.statusBadge} ${styles[row.statusType]}`}
                    >
                      {row.status}
                    </em>
                  </div>
                ))}
              </div>
            </article>

            {/* 공지사항 */}
            <article className={styles.panel}>
              <div className={styles.panelTitle}>
                <h2>공지사항</h2>
                <a href="#notice">공지사항 작성 ›</a>
              </div>
              <ul className={styles.noticeList}>
                {notices.map((item) => (
                  <li key={item.title}>
                    <strong>{item.title}</strong>
                    <span>{item.date}</span>
                  </li>
                ))}
              </ul>
            </article>

            {/* 빠른 업무 */}
            <article className={styles.panel}>
              <div className={styles.panelTitle}>
                <h2>빠른 업무</h2>
              </div>
              <div className={styles.quickGrid}>
                <button type="button">
                  <span>👤+</span>
                  사원 등록
                </button>
                <button type="button">
                  <span>⏰</span>
                  근태 관리
                </button>
                <button type="button">
                  <span>💰</span>
                  급여 관리
                </button>
                <button type="button">
                  <span>📄</span>
                  문서 관리
                </button>
              </div>
            </article>

            {/* 나의 결재함 */}
            <article className={styles.panel}>
              <div className={styles.panelTitle}>
                <h2>나의 결재함</h2>
                <a href="#my-approval">전체보기 ›</a>
              </div>
              <div className={styles.approvalSummary}>
                <span className={styles.wait}>● 대기 32</span>
                <span className={styles.approve}>● 승인 198</span>
                <span className={styles.reject}>● 반려 17</span>
              </div>
              <ul className={styles.myApprovalList}>
                {myApprovals.map((item) => (
                  <li key={item.title}>
                    <div>
                      <strong>{item.title}</strong>
                      <span>
                        {item.author} · {item.date}
                      </span>
                    </div>
                    <em
                      className={`${styles.statusBadge} ${styles[item.statusType]}`}
                    >
                      {item.status}
                    </em>
                  </li>
                ))}
              </ul>
            </article>
          </section>
        </main>
      </div>
    </div>
  );
}
