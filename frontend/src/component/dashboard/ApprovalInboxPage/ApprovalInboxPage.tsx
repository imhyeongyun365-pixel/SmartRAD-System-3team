"use client";

import { useMemo, useState } from "react";
import DashboardSidebar from "@/component/dashboard/DashboardSidebar/DashboardSidebar";

import styles from "./ApprovalInboxPage.module.scss";

type Priority = "urgent" | "normal";
type FilterType = "all" | "urgent" | "normal";
type AvatarTone = "blue" | "green" | "purple" | "yellow" | "red";
type SummaryTone = "blue" | "red" | "orange" | "green";

interface ApprovalDocument {
  id: string;
  priority: Priority;
  priorityLabel: string;
  title: string;
  attachment: string;
  drafter: string;
  drafterInitial: string;
  drafterDepartment: string;
  drafterRole: string;
  requestedAt: string;
  dDay: string;
  avatarTone: AvatarTone;
  description: string;
  fileName: string;
  fileMeta: string;
}

interface CommentItem {
  id: number;
  initial: string;
  name: string;
  tag?: string;
  time: string;
  content: string;
  tone: AvatarTone;
}

const summaryCards: {
  label: string;
  value: string;
  description: string;
  tone: SummaryTone;
  icon: "inbox" | "flash" | "clock" | "check";
}[] = [
  {
    label: "전체 대기",
    value: "32건",
    description: "처리 필요",
    tone: "blue",
    icon: "inbox",
  },
  {
    label: "긴급 결재",
    value: "6건",
    description: "즉시 처리 요망",
    tone: "red",
    icon: "flash",
  },
  {
    label: "오늘 만료",
    value: "3건",
    description: "금일 마감",
    tone: "orange",
    icon: "clock",
  },
  {
    label: "이번달 처리",
    value: "198건",
    description: "승인율 80.2%",
    tone: "green",
    icon: "check",
  },
];

const approvalDocuments: ApprovalDocument[] = [
  {
    id: "DOC-2026-0142",
    priority: "urgent",
    priorityLabel: "긴급",
    title: "연차 휴가 신청 (정은지 · 응급의학과)",
    attachment: "첨부 1개",
    drafter: "정은지",
    drafterInitial: "정",
    drafterDepartment: "응급의학과",
    drafterRole: "사원",
    requestedAt: "2026.07.09",
    dDay: "D-0",
    avatarTone: "blue",
    description:
      "2026년 7월 10일부터 7월 14일까지 연차 5일을 사용하고자 합니다. 개인 사유로 인한 신청이며, 업무 인수인계는 동료 이수현 사원에게 완료하였습니다.",
    fileName: "연차신청서_정은지.pdf",
    fileMeta: "PDF · 0.3 MB",
  },
  {
    id: "DOC-2026-0141",
    priority: "normal",
    priorityLabel: "일반",
    title: "인사발령 품의서 (간호본부 · 박서현)",
    attachment: "첨부 2개",
    drafter: "박서현",
    drafterInitial: "박",
    drafterDepartment: "간호본부",
    drafterRole: "대리",
    requestedAt: "2026.07.08",
    dDay: "D-2",
    avatarTone: "green",
    description:
      "간호본부 인력 운영 계획에 따라 병동 간 인사이동 승인을 요청합니다. 신규 배치와 교대 편성 내용을 함께 검토 부탁드립니다.",
    fileName: "인사발령_박서현.pdf",
    fileMeta: "PDF · 0.5 MB",
  },
  {
    id: "DOC-2026-0140",
    priority: "normal",
    priorityLabel: "일반",
    title: "교육비 지원 신청 (영상의학과 · 오지훈)",
    attachment: "첨부 없음",
    drafter: "오지훈",
    drafterInitial: "오",
    drafterDepartment: "영상의학과",
    drafterRole: "주임",
    requestedAt: "2026.07.07",
    dDay: "D-5",
    avatarTone: "purple",
    description:
      "직무 역량 강화를 위한 외부 전문교육 수강비 지원을 신청합니다.",
    fileName: "교육비지원_오지훈.pdf",
    fileMeta: "PDF · 0.2 MB",
  },
  {
    id: "DOC-2026-0139",
    priority: "urgent",
    priorityLabel: "긴급",
    title: "재직증명서 발급 요청 (원무팀 · 강민서)",
    attachment: "첨부 1개",
    drafter: "강민서",
    drafterInitial: "강",
    drafterDepartment: "원무팀",
    drafterRole: "사원",
    requestedAt: "2026.07.06",
    dDay: "D-0",
    avatarTone: "yellow",
    description: "금융기관 제출을 위한 재직증명서 긴급 발급을 요청합니다.",
    fileName: "재직증명서_강민서.pdf",
    fileMeta: "PDF · 0.2 MB",
  },
  {
    id: "DOC-2026-0138",
    priority: "normal",
    priorityLabel: "일반",
    title: "하계휴가 집중사용 신청서 (총무팀 · 최준혁)",
    attachment: "첨부 없음",
    drafter: "최준혁",
    drafterInitial: "최",
    drafterDepartment: "총무팀",
    drafterRole: "주임",
    requestedAt: "2026.07.05",
    dDay: "D-7",
    avatarTone: "red",
    description: "하계휴가 집중 사용 기간에 맞춰 휴가 승인을 요청합니다.",
    fileName: "하계휴가신청_최준혁.pdf",
    fileMeta: "PDF · 0.2 MB",
  },
];

const comments: CommentItem[] = [
  {
    id: 1,
    initial: "김",
    name: "김관리",
    tag: "결재자",
    time: "2025.06.25 10:30",
    content:
      "첨부 서류를 확인했습니다. 업무 인수인계 완료 여부를 이수현 사원에게도 확인 부탁드립니다.",
    tone: "blue",
  },
  {
    id: 2,
    initial: "이",
    name: "이수현",
    tag: "참조",
    time: "2025.06.25 11:15",
    content:
      "인수인계 완료되었습니다. 7월 9일 오전 중으로 업무 정리 문서 공유하겠습니다.",
    tone: "purple",
  },
];

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4 4" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 4v10" />
      <path d="m8 10 4 4 4-4" />
      <path d="M5 19h14" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6.5 16.5h11" />
      <path d="M8 16.5V10a4 4 0 1 1 8 0v6.5" />
      <path d="M10 19a2.2 2.2 0 0 0 4 0" />
    </svg>
  );
}

function DetailArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 12h8" />
      <path d="m12 7 5 5-5 5" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16v10H4z" />
      <path d="m4 8 8 6 8-6" />
    </svg>
  );
}

function UserPlusIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="10" cy="9" r="3" />
      <path d="M4.5 18c.5-3.3 2.2-5 5.5-5s5 1.7 5.5 5" />
      <path d="M18 8v6" />
      <path d="M15 11h6" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 3h8l4 4v14H7z" />
      <path d="M15 3v5h4" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 7.5h12a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H11l-4 3v-3H6a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

function SummaryIcon({
  type,
}: {
  type: "inbox" | "flash" | "clock" | "check";
}) {
  if (type === "inbox") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 8.5A2.5 2.5 0 0 1 6.5 6h11A2.5 2.5 0 0 1 20 8.5v7A2.5 2.5 0 0 1 17.5 18h-11A2.5 2.5 0 0 1 4 15.5z" />
        <path d="M8 11h2l1.2 2h1.6L14 11h2" />
      </svg>
    );
  }

  if (type === "flash") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M13 3 6 13h5l-1 8 8-11h-5l1-7Z" />
      </svg>
    );
  }

  if (type === "clock") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v4l3 2" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m7.5 12 3 3 6-7" />
      <circle cx="12" cy="12" r="8" />
    </svg>
  );
}

export default function ApprovalInboxPage() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [keyword, setKeyword] = useState("");
  const [selectedId, setSelectedId] = useState(approvalDocuments[0].id);

  const [isDetailOpen, setIsDetailOpen] = useState(true);

  const filteredDocuments = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return approvalDocuments.filter((document) => {
      const matchesFilter = filter === "all" || document.priority === filter;

      const matchesKeyword =
        normalizedKeyword.length === 0 ||
        document.id.toLowerCase().includes(normalizedKeyword) ||
        document.title.toLowerCase().includes(normalizedKeyword) ||
        document.drafter.toLowerCase().includes(normalizedKeyword);

      return matchesFilter && matchesKeyword;
    });
  }, [filter, keyword]);

  const selectedDocument =
    approvalDocuments.find((document) => document.id === selectedId) ??
    approvalDocuments[0];

  return (
    <div className={styles.dashboard}>
      <DashboardSidebar />

      <div className={styles.pageArea}>
        <header className={styles.topHeader}>
          <label className={styles.globalSearch}>
            <SearchIcon />
            <input type="search" placeholder="직원, 부서, 문서를 검색하세요" />
          </label>

          <div className={styles.topActions}>
            <button
              type="button"
              className={styles.notificationButton}
              aria-label="알림"
            >
              <BellIcon />
            </button>

            <div className={styles.profile}>
              <span>김</span>

              <div>
                <strong>김관리</strong>
                <small>인사팀 · 관리자</small>
              </div>
            </div>
          </div>
        </header>

        <div
          className={`${styles.contentGrid} ${
            !isDetailOpen ? styles.detailClosed : ""
          }`}
        >
          <main className={styles.main}>
            <section className={styles.pageHeader}>
              <div>
                <h1>결재 대기함</h1>
                <p>처리가 필요한 결재 문서 목록입니다.</p>
              </div>

              <button type="button" className={styles.exportButton}>
                <DownloadIcon />
                <span>내보내기</span>
              </button>
            </section>

            <section className={styles.summaryGrid}>
              {summaryCards.map((card) => (
                <article key={card.label} className={styles.summaryCard}>
                  <div className={styles.summaryBody}>
                    <p>{card.label}</p>
                    <h2>{card.value}</h2>
                    <span className={styles[`${card.tone}Text`]}>
                      {card.description}
                    </span>
                  </div>

                  <span
                    className={`${styles.summaryIcon} ${
                      styles[`${card.tone}Icon`]
                    }`}
                  >
                    <SummaryIcon type={card.icon} />
                  </span>
                </article>
              ))}
            </section>

            <section className={styles.tableCard}>
              <div className={styles.tableToolbar}>
                <div className={styles.filterButtons}>
                  <button
                    type="button"
                    className={filter === "all" ? styles.activeFilter : ""}
                    onClick={() => setFilter("all")}
                  >
                    전체
                  </button>

                  <button
                    type="button"
                    className={filter === "urgent" ? styles.activeFilter : ""}
                    onClick={() => setFilter("urgent")}
                  >
                    긴급
                  </button>

                  <button
                    type="button"
                    className={filter === "normal" ? styles.activeFilter : ""}
                    onClick={() => setFilter("normal")}
                  >
                    일반
                  </button>
                </div>

                <label className={styles.tableSearch}>
                  <SearchIcon />
                  <input
                    type="search"
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                    placeholder="문서 검색"
                  />
                </label>
              </div>

              <div className={styles.tableWrapper}>
                <table className={styles.approvalTable}>
                  <thead>
                    <tr>
                      <th>우선</th>
                      <th>문서번호</th>
                      <th>결재 제목</th>
                      <th>기안자</th>
                      <th>요청일</th>
                      <th>D-day</th>
                      <th>상세</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredDocuments.map((document) => {
                      const isSelected = selectedId === document.id;

                      return (
                        <tr
                          key={document.id}
                          className={isSelected ? styles.selectedRow : ""}
                          onClick={() => setSelectedId(document.id)}
                        >
                          <td>
                            <span
                              className={`${styles.priorityBadge} ${
                                document.priority === "urgent"
                                  ? styles.urgent
                                  : styles.normal
                              }`}
                            >
                              {document.priorityLabel}
                            </span>
                          </td>

                          <td className={styles.documentId}>{document.id}</td>

                          <td className={styles.documentTitle}>
                            <strong>{document.title}</strong>
                            <small>{document.attachment}</small>
                          </td>

                          <td>
                            <div className={styles.drafter}>
                              <span
                                className={`${styles.avatar} ${
                                  styles[
                                    `avatar${
                                      document.avatarTone
                                        .charAt(0)
                                        .toUpperCase() +
                                      document.avatarTone.slice(1)
                                    }`
                                  ]
                                }`}
                              >
                                {document.drafterInitial}
                              </span>

                              <p>{document.drafter}</p>
                            </div>
                          </td>

                          <td>{document.requestedAt}</td>

                          <td>
                            <span
                              className={`${styles.dDay} ${
                                document.dDay === "D-0"
                                  ? styles.dDayUrgent
                                  : styles.dDayNormal
                              }`}
                            >
                              {document.dDay}
                            </span>
                          </td>

                          <td>
                            <button
                              type="button"
                              className={`${styles.detailButton} ${
                                isSelected ? styles.detailButtonActive : ""
                              }`}
                              aria-label={`${document.title} 상세보기`}
                            >
                              <DetailArrowIcon />
                            </button>
                          </td>
                        </tr>
                      );
                    })}

                    {filteredDocuments.length === 0 && (
                      <tr>
                        <td colSpan={7} className={styles.emptyState}>
                          검색 결과가 없습니다.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className={styles.tableFooter}>
                <p>총 32건 중 1-5 표시</p>

                <div className={styles.pagination}>
                  <button type="button">‹</button>
                  <button type="button" className={styles.currentPage}>
                    1
                  </button>
                  <button type="button">2</button>
                  <button type="button">3</button>
                  <button type="button">›</button>
                </div>
              </div>
            </section>
          </main>
          {isDetailOpen && (
            <aside className={styles.detailPanel}>
              <div className={styles.detailHeader}>
                <div>
                  <small>문서 상세</small>
                  <strong>{selectedDocument.id}</strong>
                </div>

                <button
                  type="button"
                  aria-label="상세 패널 닫기"
                  onClick={() => setIsDetailOpen(false)}
                >
                  ×
                </button>
              </div>

              <div className={styles.documentSummary}>
                <div className={styles.summaryBadges}>
                  <span className={styles.summaryBadgeUrgent}>긴급</span>
                  <span className={styles.summaryBadgeDeadline}>
                    D-0 오늘 마감
                  </span>
                </div>

                <h2>{selectedDocument.title}</h2>

                <p>
                  <span>◷ {selectedDocument.requestedAt}</span>
                  <span>첨부 1개</span>
                </p>
              </div>

              <div className={styles.detailContent}>
                <section className={styles.detailSection}>
                  <h3>기안자 정보</h3>

                  <div className={styles.userCard}>
                    <span className={styles.userAvatar}>
                      {selectedDocument.drafterInitial}
                    </span>

                    <div className={styles.userInfo}>
                      <strong>{selectedDocument.drafter}</strong>
                      <small>
                        {selectedDocument.drafterDepartment} ·{" "}
                        {selectedDocument.drafterRole}
                      </small>
                    </div>

                    <div className={styles.userActions}>
                      <button type="button" aria-label="메일">
                        <MailIcon />
                      </button>

                      <button type="button" aria-label="추가">
                        <UserPlusIcon />
                      </button>
                    </div>
                  </div>
                </section>

                <section className={styles.detailSection}>
                  <h3>결재선</h3>

                  <div className={styles.approvalStep}>
                    <span className={styles.stepNumber}>1</span>
                    <span
                      className={`${styles.stepAvatar} ${styles.avatarBlue}`}
                    >
                      김
                    </span>

                    <div className={styles.stepInfo}>
                      <strong>김관리 팀장</strong>
                      <small>인사팀 · 1차 결재</small>
                    </div>

                    <em className={styles.waitingBadge}>대기중</em>
                  </div>

                  <div className={styles.approvalStep}>
                    <span className={styles.stepNumber}>2</span>
                    <span
                      className={`${styles.stepAvatar} ${styles.avatarGreen}`}
                    >
                      박
                    </span>

                    <div className={styles.stepInfo}>
                      <strong>박원장 부장</strong>
                      <small>경영지원 · 최종 결재</small>
                    </div>

                    <em className={styles.pendingBadge}>미도달</em>
                  </div>
                </section>

                <section className={styles.detailSection}>
                  <h3>요청 내용</h3>

                  <div className={styles.requestContent}>
                    {selectedDocument.description}
                  </div>
                </section>

                <section className={styles.detailSection}>
                  <h3>첨부 파일</h3>

                  <div className={styles.fileCard}>
                    <span className={styles.fileIconBox}>
                      <FileIcon />
                    </span>

                    <div className={styles.fileInfo}>
                      <strong>{selectedDocument.fileName}</strong>
                      <small>{selectedDocument.fileMeta}</small>
                    </div>

                    <button type="button" className={styles.fileDownload}>
                      ↓ 다운
                    </button>
                  </div>
                </section>

                <section className={styles.commentSection}>
                  <div className={styles.commentHeader}>
                    <div className={styles.commentTitle}>
                      <ChatIcon />
                      <h3>의견 및 코멘트</h3>
                    </div>

                    <span>2</span>
                  </div>

                  <div className={styles.commentList}>
                    {comments.map((comment) => (
                      <article key={comment.id} className={styles.commentItem}>
                        <span
                          className={`${styles.commentAvatar} ${
                            styles[
                              `avatar${
                                comment.tone.charAt(0).toUpperCase() +
                                comment.tone.slice(1)
                              }`
                            ]
                          }`}
                        >
                          {comment.initial}
                        </span>

                        <div className={styles.commentBody}>
                          <header>
                            <div className={styles.commentMeta}>
                              <strong>{comment.name}</strong>
                              {comment.tag && <em>{comment.tag}</em>}
                            </div>

                            <small>{comment.time}</small>
                          </header>

                          <p>{comment.content}</p>
                        </div>
                      </article>
                    ))}
                  </div>

                  <div className={styles.commentInput}>
                    <span
                      className={`${styles.commentAvatar} ${styles.avatarBlue}`}
                    >
                      김
                    </span>

                    <input type="text" placeholder="의견을 입력하세요..." />

                    <button type="button">전송</button>
                  </div>
                </section>
              </div>

              <div className={styles.detailActions}>
                <button type="button" className={styles.rejectButton}>
                  × 반려
                </button>

                <button type="button" className={styles.approveButton}>
                  ✓ 승인
                </button>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
