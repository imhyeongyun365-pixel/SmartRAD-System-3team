"use client";

import { useMemo, useState } from "react";
import DashboardSidebar from "../DashboardSidebar/DashboardSidebar";

import styles from "./ApprovalInboxPage.module.scss";

type Priority = "urgent" | "normal";
type ApprovalStatus = "waiting" | "unread";

interface ApprovalDocument {
  id: string;
  priority: Priority;
  priorityLabel: string;
  title: string;
  attachment: string;
  drafter: string;
  drafterInitial: string;
  department: string;
  requestedAt: string;
  dDay: string;
  status: ApprovalStatus;
  description: string;
  fileName: string;
}

const summaryCards = [
  {
    label: "전체 대기",
    value: "32건",
    description: "처리 필요",
    color: "blue",
    icon: "▣",
  },
  {
    label: "긴급 결재",
    value: "6건",
    description: "즉시 처리 요망",
    color: "red",
    icon: "ϟ",
  },
  {
    label: "오늘 만료",
    value: "3건",
    description: "금일 마감",
    color: "orange",
    icon: "◷",
  },
  {
    label: "이번달 처리",
    value: "198건",
    description: "승인율 80.2%",
    color: "green",
    icon: "✓",
  },
] as const;

const approvalDocuments: ApprovalDocument[] = [
  {
    id: "DOC-2026-0142",
    priority: "urgent",
    priorityLabel: "긴급",
    title: "연차 휴가 신청 (정은지 · 응급의학과)",
    attachment: "첨부 1개",
    drafter: "정은지",
    drafterInitial: "정",
    department: "응급의학과 · 사원",
    requestedAt: "2026.07.09",
    dDay: "D-0",
    status: "waiting",
    description:
      "2026년 7월 10일부터 7월 14일까지 연차 5일을 사용하고자 합니다. 개인 사유로 인한 신청이며, 업무 인수인계는 동료 이수현 사원에게 완료하였습니다.",
    fileName: "연차신청서_정은지.pdf",
  },
  {
    id: "DOC-2026-0141",
    priority: "normal",
    priorityLabel: "일반",
    title: "인사발령 품의서 (간호본부 · 박서현)",
    attachment: "첨부 2개",
    drafter: "박서현",
    drafterInitial: "박",
    department: "간호본부 · 간호사",
    requestedAt: "2026.07.08",
    dDay: "D-2",
    status: "waiting",
    description:
      "간호본부 인력 운영 계획에 따라 병동 간 인사이동 승인을 요청합니다.",
    fileName: "인사발령_박서현.pdf",
  },
  {
    id: "DOC-2026-0140",
    priority: "normal",
    priorityLabel: "일반",
    title: "교육비 지원 신청 (영상의학과 · 오지훈)",
    attachment: "첨부 없음",
    drafter: "오지훈",
    drafterInitial: "오",
    department: "영상의학과 · 방사선사",
    requestedAt: "2026.07.07",
    dDay: "D-5",
    status: "waiting",
    description:
      "직무 역량 강화를 위한 외부 전문교육 수강비 지원을 신청합니다.",
    fileName: "교육비지원_오지훈.pdf",
  },
  {
    id: "DOC-2026-0139",
    priority: "urgent",
    priorityLabel: "긴급",
    title: "재직증명서 발급 요청 (원무팀 · 강민서)",
    attachment: "첨부 1개",
    drafter: "강민서",
    drafterInitial: "강",
    department: "원무팀 · 사원",
    requestedAt: "2026.07.06",
    dDay: "D-0",
    status: "unread",
    description: "금융기관 제출을 위한 재직증명서 긴급 발급을 요청합니다.",
    fileName: "재직증명서_강민서.pdf",
  },
  {
    id: "DOC-2026-0138",
    priority: "normal",
    priorityLabel: "일반",
    title: "하계휴가 집중사용 신청서 (총무팀 · 최준혁)",
    attachment: "첨부 없음",
    drafter: "최준혁",
    drafterInitial: "최",
    department: "총무팀 · 대리",
    requestedAt: "2026.07.05",
    dDay: "D-7",
    status: "waiting",
    description: "하계휴가 집중 사용 기간에 맞춰 휴가 승인을 요청합니다.",
    fileName: "하계휴가신청_최준혁.pdf",
  },
];

export default function ApprovalInboxPage() {
  const [filter, setFilter] = useState<"all" | "urgent" | "normal">("all");
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

  const selectDocument = (documentId: string) => {
    setSelectedId(documentId);
    setIsDetailOpen(true);
  };

  return (
    <div
      className={`${styles.dashboard} ${
        !isDetailOpen ? styles.detailClosed : ""
      }`}
    >
      <DashboardSidebar />

      <div className={styles.pageArea}>
        <header className={styles.topHeader}>
          <label className={styles.globalSearch}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m16.5 16.5 4 4" />
            </svg>

            <input type="search" placeholder="직원, 부서, 문서를 검색하세요" />
          </label>

          <div className={styles.topActions}>
            <div className={styles.profile}>
              <span>김</span>

              <div>
                <strong>김관리</strong>
                <small>인사팀 · 관리자</small>
              </div>
            </div>
          </div>
        </header>

        <main className={styles.main}>
          <section className={styles.pageHeader}>
            <div>
              <h1>결재 대기함</h1>
              <p>처리가 필요한 결재 문서 목록입니다.</p>
            </div>

            <button type="button" className={styles.exportButton}>
              ⇩ 내보내기
            </button>
          </section>

          <section className={styles.summaryGrid}>
            {summaryCards.map((card) => (
              <article key={card.label} className={styles.summaryCard}>
                <div>
                  <p>{card.label}</p>
                  <h2>{card.value}</h2>

                  <span className={styles[`${card.color}Text`]}>
                    {card.description}
                  </span>
                </div>

                <span
                  className={`${styles.summaryIcon} ${
                    styles[`${card.color}Icon`]
                  }`}
                >
                  {card.icon}
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
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m16.5 16.5 4 4" />
                </svg>

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
                  {filteredDocuments.map((document) => (
                    <tr
                      key={document.id}
                      className={
                        selectedId === document.id ? styles.selectedRow : ""
                      }
                      onClick={() => selectDocument(document.id)}
                    >
                      <td>
                        <span
                          className={`${styles.priorityBadge} ${
                            styles[document.priority]
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
                          <span>{document.drafterInitial}</span>
                          <p>{document.drafter}</p>
                        </div>
                      </td>

                      <td>{document.requestedAt}</td>

                      <td>
                        <span
                          className={`${styles.dDay} ${
                            document.dDay === "D-0" ? styles.dDayUrgent : ""
                          }`}
                        >
                          {document.dDay}
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          className={styles.detailButton}
                          aria-label={`${document.title} 상세보기`}
                        >
                          →
                        </button>
                      </td>
                    </tr>
                  ))}

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
      </div>

      {isDetailOpen && (
        <aside className={styles.detailPanel}>
          <div className={styles.detailHeader}>
            <div>
              <small>문서 상세</small>
              <strong>{selectedDocument.id}</strong>
            </div>

            <button
              type="button"
              onClick={() => setIsDetailOpen(false)}
              aria-label="상세 패널 닫기"
            >
              ×
            </button>
          </div>

          <div className={styles.documentSummary}>
            <div className={styles.summaryBadges}>
              <span className={styles.urgentLabel}>긴급</span>
              <span>D-0 오늘 마감</span>
            </div>

            <h2>{selectedDocument.title}</h2>

            <p>▣ {selectedDocument.requestedAt}　　⌕ 첨부 1개</p>
          </div>

          <div className={styles.detailContent}>
            <section className={styles.detailSection}>
              <h3>기안자 정보</h3>

              <div className={styles.userCard}>
                <span>{selectedDocument.drafterInitial}</span>

                <div>
                  <strong>{selectedDocument.drafter}</strong>
                  <small>{selectedDocument.department}</small>
                </div>

                <em>✉　♧</em>
              </div>
            </section>

            <section className={styles.detailSection}>
              <h3>결재선</h3>

              <div className={`${styles.approvalStep} ${styles.currentStep}`}>
                <span>1</span>
                <i>김</i>

                <div>
                  <strong>김관리 팀장</strong>
                  <small>인사팀 · 1차 결재</small>
                </div>

                <em>대기중</em>
              </div>

              <div className={styles.approvalStep}>
                <span>2</span>
                <i>박</i>

                <div>
                  <strong>박원장 부장</strong>
                  <small>경영지원 · 최종 결재</small>
                </div>

                <em>미도달</em>
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
                <span>▧</span>

                <div>
                  <strong>{selectedDocument.fileName}</strong>
                  <small>PDF · 0.3 MB</small>
                </div>

                <button type="button">⇩ 다운</button>
              </div>
            </section>

            <section className={styles.commentSection}>
              <div className={styles.commentTitle}>
                <h3>□ 의견 및 코멘트</h3>
                <span>2</span>
              </div>

              <article className={styles.comment}>
                <span>김</span>

                <div>
                  <header>
                    <strong>김관리</strong>
                    <small>2025.06.25 10:30</small>
                  </header>

                  <p>
                    첨부 서류를 확인했습니다. 업무 인수인계 완료 여부를 이수현
                    사원에게도 확인 부탁드립니다.
                  </p>
                </div>
              </article>

              <article className={styles.comment}>
                <span>이</span>

                <div>
                  <header>
                    <strong>이수현</strong>
                    <small>2025.06.25 11:15</small>
                  </header>

                  <p>
                    인수인계 완료되었습니다. 7월 9일 오전 중으로 업무 정리 문서
                    공유하겠습니다.
                  </p>
                </div>
              </article>

              <div className={styles.commentInput}>
                <span>김</span>
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
  );
}
