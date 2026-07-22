"use client";

import { useMemo, useState } from "react";
import DashboardSidebar from "@/component/dashboard/DashboardSidebar/DashboardSidebar";
import type { EmployeeManagementData } from "@/types/employee";
import styles from "./EmployeeManagementPage.module.scss";

interface Props {
  initialData: EmployeeManagementData;
}

const FILTERS = ["전체", "정규직", "계약직", "인턴"] as const;

export default function EmployeeManagementPage({ initialData }: Props) {
  const [keyword, setKeyword] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("전체");
  const [selectedId, setSelectedId] = useState(
    initialData.selectedEmployee?.id ?? null,
  );
  const [activeTab, setActiveTab] = useState<
    "basic" | "history" | "license" | "health"
  >("basic");

  const filteredEmployees = useMemo(() => {
    return initialData.employees.filter((emp) => {
      const matchFilter = filter === "전체" || emp.employmentType === filter;
      const matchKeyword =
        !keyword ||
        emp.name.includes(keyword) ||
        emp.department.includes(keyword) ||
        emp.employeeNo.toLowerCase().includes(keyword.toLowerCase());
      return matchFilter && matchKeyword;
    });
  }, [initialData.employees, filter, keyword]);

  // 실제로는 selectedId로 상세 데이터를 가져와야 하지만, 지금은 mock의 selectedEmployee 사용
  const selected = initialData.selectedEmployee;

  return (
    <div className={styles.dashboard}>
      <DashboardSidebar />

      <div className={styles.pageArea}>
        {/* ========== 상단 헤더 ========== */}
        <header className={styles.topHeader}>
          <div className={styles.globalSearch}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input placeholder="직원, 부서, 문서를 검색하세요" />
          </div>

          <div className={styles.topActions}>
            <button type="button" className={styles.notifBtn} aria-label="알림">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
            </button>

            <div className={styles.userChip}>
              <span className={styles.userAvatar}>김</span>
              <div>
                <strong>김관리</strong>
                <small>인사팀 · 관리자</small>
              </div>
            </div>
          </div>
        </header>

        {/* ========== 메인 ========== */}
        <main className={styles.main}>
          <div className={styles.contentLayout}>
            {/* ===== 왼쪽 리스트 박스 ===== */}
            <section className={styles.listBox}>
              <div className={styles.listHeader}>
                <div>
                  <h1 className={styles.listTitle}>직원 목록</h1>
                  <p className={styles.listCount}>
                    총 {initialData.totalCount.toLocaleString()}명
                  </p>
                </div>
                <button type="button" className={styles.addBtn}>
                  + 직원 추가
                </button>
              </div>

              <div className={styles.listSearch}>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="직원 검색"
                />
              </div>

              <div className={styles.filterTabs}>
                {FILTERS.map((f) => (
                  <button
                    key={f}
                    type="button"
                    className={filter === f ? styles.filterActive : ""}
                    onClick={() => setFilter(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div className={styles.empList}>
                {filteredEmployees.map((emp) => (
                  <button
                    key={emp.id}
                    type="button"
                    className={`${styles.empCard} ${
                      selectedId === emp.id ? styles.empCardActive : ""
                    }`}
                    onClick={() => setSelectedId(emp.id)}
                  >
                    <span
                      className={`${styles.avatar} ${styles[emp.avatarTone]}`}
                    >
                      {emp.initial}
                    </span>
                    <div className={styles.empInfo}>
                      <div className={styles.empNameRow}>
                        <strong>{emp.name}</strong>
                        <span
                          className={`${styles.statusBadge} ${
                            styles[emp.status]
                          }`}
                        >
                          {emp.statusLabel}
                        </span>
                      </div>
                      <p>
                        {emp.department} · {emp.position}
                      </p>
                      <small>{emp.employeeNo}</small>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* ===== 오른쪽 상세 패널 ===== */}
            {selected && (
              <section className={styles.detailPanel}>
                {/* 프로필 헤더 */}
                <div className={styles.profileHeader}>
                  <div className={styles.profileLeft}>
                    <span
                      className={`${styles.profileAvatar} ${
                        styles[selected.avatarTone]
                      }`}
                    >
                      {selected.initial}
                    </span>
                    <div className={styles.profileMeta}>
                      <div className={styles.profileNameRow}>
                        <h2>{selected.name}</h2>
                        <span
                          className={`${styles.statusBadge} ${
                            styles[selected.status]
                          }`}
                        >
                          {selected.statusLabel}
                        </span>
                      </div>
                      <p className={styles.profileDept}>
                        {selected.department} · {selected.position}
                      </p>
                      <p className={styles.profileSub}>
                        <span>{selected.employeeNo}</span>
                        <span className={styles.dot}>·</span>
                        <span>입사일 {selected.hireDate} (6년차)</span>
                      </p>
                    </div>
                  </div>
                  <button type="button" className={styles.editBtn}>
                    정보 수정
                  </button>
                </div>

                {/* 탭 */}
                <div className={styles.tabs}>
                  {[
                    { key: "basic", label: "기본정보" },
                    { key: "history", label: "재직 이력" },
                    { key: "license", label: "자격증·교육" },
                    { key: "health", label: "건강검진" },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      className={activeTab === tab.key ? styles.tabActive : ""}
                      onClick={() => setActiveTab(tab.key as typeof activeTab)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* ===== 기본정보 탭 내용 ===== */}
                {activeTab === "basic" && (
                  <div className={styles.detailBody}>
                    <div className={styles.cardGrid}>
                      {/* 인적사항 */}
                      <article className={styles.card}>
                        <div className={styles.cardTitle}>
                          <span
                            className={`${styles.cardIcon} ${styles.iconBlue}`}
                          >
                            👤
                          </span>
                          <h3>인적사항</h3>
                        </div>
                        <div className={styles.infoGrid}>
                          <div>
                            <label>성명</label>
                            <p>{selected.name}</p>
                          </div>
                          <div>
                            <label>생년월일</label>
                            <p>{selected.birthDate}</p>
                          </div>
                          <div>
                            <label>성별</label>
                            <p>{selected.gender}</p>
                          </div>
                          <div>
                            <label>연락처</label>
                            <p>{selected.phone}</p>
                          </div>
                          <div>
                            <label>내선 번호</label>
                            <p>02-1234-3300</p>
                          </div>
                          <div>
                            <label>이메일</label>
                            <p>{selected.email}</p>
                          </div>
                          <div className={styles.full}>
                            <label>주소</label>
                            <p>{selected.address}</p>
                          </div>
                          <div className={styles.full}>
                            <label>긴급 연락처</label>
                            <p>{selected.emergencyContact}</p>
                          </div>
                        </div>
                      </article>

                      {/* 의료 전문 정보 */}
                      <article className={styles.card}>
                        <div className={styles.cardTitle}>
                          <span
                            className={`${styles.cardIcon} ${styles.iconOrange}`}
                          >
                            🩺
                          </span>
                          <h3>의료 전문 정보</h3>
                        </div>
                        <div className={styles.infoGrid}>
                          <div>
                            <label>면허 유형</label>
                            <p>{selected.licenseType}</p>
                          </div>
                          <div>
                            <label>면허 번호</label>
                            <p>{selected.licenseNo}</p>
                          </div>
                          <div>
                            <label>취득일</label>
                            <p>{selected.acquiredDate}</p>
                          </div>
                          <div>
                            <label>전문과목</label>
                            <p>{selected.specialty}</p>
                          </div>
                        </div>
                        <div className={styles.tagRow}>
                          <span className={styles.tag}>전문의자격</span>
                          <span className={styles.tag}>초음파 자격</span>
                        </div>
                      </article>

                      {/* 소속 및 직무 */}
                      <article className={styles.card}>
                        <div className={styles.cardTitle}>
                          <span
                            className={`${styles.cardIcon} ${styles.iconGreen}`}
                          >
                            🏢
                          </span>
                          <h3>소속 및 직무</h3>
                        </div>
                        <div className={styles.infoGrid}>
                          <div>
                            <label>부서</label>
                            <p>{selected.departmentFull}</p>
                          </div>
                          <div>
                            <label>직위</label>
                            <p>{selected.jobTitle}</p>
                          </div>
                          <div>
                            <label>직급</label>
                            <p>{selected.rank}</p>
                          </div>
                          <div>
                            <label>고용 형태</label>
                            <p>{selected.workType}</p>
                          </div>
                          <div>
                            <label>입사일</label>
                            <p>{selected.hireDate}</p>
                          </div>
                          <div>
                            <label>사번</label>
                            <p>{selected.employeeNoFull}</p>
                          </div>
                          <div>
                            <label>근무 형태</label>
                            <p>정규직</p>
                          </div>
                          <div>
                            <label>근무지</label>
                            <p>{selected.duty}</p>
                          </div>
                        </div>
                      </article>

                      {/* 직급 · 호봉 */}
                      <article className={styles.card}>
                        <div className={styles.cardTitle}>
                          <span
                            className={`${styles.cardIcon} ${styles.iconPurple}`}
                          >
                            📈
                          </span>
                          <h3>직급 · 호봉</h3>
                        </div>
                        <div className={styles.rankGrid}>
                          <div>
                            <label>현재 직급</label>
                            <p className={styles.rankValue}>
                              {selected.currentRank}
                            </p>
                            <span className={styles.rankSub}>
                              Manager · 3급
                            </span>
                          </div>
                          <div>
                            <label>현재 호봉</label>
                            <p className={styles.rankValueBlue}>
                              {selected.currentPayGrade}
                            </p>
                          </div>
                          <div>
                            <label>승급 예정일</label>
                            <p className={styles.rankDate}>
                              {selected.promotionDate}
                            </p>
                            <span className={styles.rankSub}>
                              차기 승급 예정
                            </span>
                          </div>
                        </div>
                        <div className={styles.progressWrap}>
                          <div className={styles.progressLabel}>
                            <span>호봉 진행도</span>
                            <span>18 / 20호봉</span>
                          </div>
                          <div className={styles.progressBar}>
                            <div
                              className={styles.progressFill}
                              style={{ width: "90%" }}
                            />
                          </div>
                        </div>
                      </article>

                      {/* 행정 · 급여 정보 */}
                      <article className={styles.card}>
                        <div className={styles.cardTitle}>
                          <span
                            className={`${styles.cardIcon} ${styles.iconBlue}`}
                          >
                            💳
                          </span>
                          <h3>행정 · 급여 정보</h3>
                        </div>
                        <div className={styles.infoGrid}>
                          <div>
                            <label>직원 코드</label>
                            <p>INT-2019-0191</p>
                          </div>
                          <div>
                            <label>급여 유형</label>
                            <p>월급제</p>
                          </div>
                          <div>
                            <label>급여 지급일</label>
                            <p>{selected.salaryDay}</p>
                          </div>
                        </div>
                        <div className={styles.bankBox}>
                          <div className={styles.bankInfo}>
                            <strong>{selected.bankName}</strong>
                            <span>{selected.accountNo}</span>
                          </div>
                          <span className={styles.verifiedBadge}>
                            계좌 번호 인증 완료
                          </span>
                        </div>
                        <div
                          className={styles.infoGrid}
                          style={{ marginTop: 14 }}
                        >
                          <div>
                            <label>세금 공제</label>
                            <p>근로소득세 (일반)</p>
                          </div>
                          <div>
                            <label>직원 상태</label>
                            <p className={styles.statusText}>재직</p>
                          </div>
                        </div>
                      </article>

                      {/* 직급 · 호봉 변동 이력 */}
                      <article className={styles.card}>
                        <div className={styles.cardTitleRow}>
                          <div className={styles.cardTitle}>
                            <span
                              className={`${styles.cardIcon} ${styles.iconCyan}`}
                            >
                              📋
                            </span>
                            <h3>직급 · 호봉 변동 이력</h3>
                          </div>
                          <button
                            type="button"
                            className={styles.addHistoryBtn}
                          >
                            + 이력 추가
                          </button>
                        </div>
                        <table className={styles.historyTable}>
                          <thead>
                            <tr>
                              <th>변동일</th>
                              <th>변동 유형</th>
                              <th>직급 (전→후)</th>
                              <th>호봉 (전→후)</th>
                              <th>처리자</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selected.rankHistory.map((h, i) => (
                              <tr key={i}>
                                <td>{h.date}</td>
                                <td>{h.type}</td>
                                <td>
                                  {h.fromRank} → {h.toRank}
                                </td>
                                <td>
                                  {h.fromGrade} → {h.toGrade}
                                </td>
                                <td>{h.author}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </article>
                    </div>
                  </div>
                )}

                {/* ===== 재직·휴직 탭 ===== */}
                {activeTab === "history" && (
                  <div className={styles.detailBody}>
                    {/* 상단 요약 카드 4개 */}
                    <div className={styles.summaryRow}>
                      <div className={styles.summaryCard}>
                        <div className={styles.summaryIconGreen}>●</div>
                        <div>
                          <label>현재 재직 상태</label>
                          <p className={styles.statusText}>재직</p>
                        </div>
                      </div>
                      <div className={styles.summaryCard}>
                        <div className={styles.summaryIconBlue}>📅</div>
                        <div>
                          <label>입사일</label>
                          <p>2019.03.02</p>
                        </div>
                      </div>
                      <div className={styles.summaryCard}>
                        <div className={styles.summaryIconOrange}>⏱</div>
                        <div>
                          <label>근속 기간</label>
                          <p>7년 4개월</p>
                        </div>
                      </div>
                      <div className={styles.summaryCard}>
                        <div className={styles.summaryIconPurple}>📋</div>
                        <div>
                          <label>총 휴직 기간</label>
                          <p>0일</p>
                        </div>
                      </div>
                    </div>

                    <div className={styles.historyLayout}>
                      {/* 왼쪽: 재직·발령 이력 */}
                      <article className={styles.card}>
                        <div className={styles.cardTitleRow}>
                          <div className={styles.cardTitle}>
                            <span
                              className={`${styles.cardIcon} ${styles.iconGreen}`}
                            >
                              📄
                            </span>
                            <h3>재직·발령 이력</h3>
                          </div>
                          <button
                            type="button"
                            className={styles.addHistoryBtn}
                          >
                            + 이력 추가
                          </button>
                        </div>

                        <div className={styles.timeline}>
                          <div className={styles.timelineItem}>
                            <div
                              className={`${styles.timelineDot} ${styles.dotGreen}`}
                            >
                              ✓
                            </div>
                            <div className={styles.timelineContent}>
                              <div className={styles.timelineHeader}>
                                <strong>재직</strong>
                                <span>2019.03.02 ~ 현재</span>
                              </div>
                              <p>신규 입사 · 영상의학과 방사선사</p>
                              <small>입사 · 정규직 · 고용 형태: 정규직</small>
                            </div>
                          </div>

                          <div className={styles.timelineItem}>
                            <div
                              className={`${styles.timelineDot} ${styles.dotBlue}`}
                            >
                              ↑
                            </div>
                            <div className={styles.timelineContent}>
                              <div className={styles.timelineHeader}>
                                <strong>승진</strong>
                                <span>2021.03.02</span>
                              </div>
                              <p>대리 → 과장 승진</p>
                              <small>
                                처리자: 김인사 · 직급: 8호봉 → 10호봉
                              </small>
                            </div>
                          </div>

                          <div className={styles.timelineItem}>
                            <div
                              className={`${styles.timelineDot} ${styles.dotBlue}`}
                            >
                              ↑
                            </div>
                            <div className={styles.timelineContent}>
                              <div className={styles.timelineHeader}>
                                <strong>부서 이동</strong>
                                <span>2024.03.02</span>
                              </div>
                              <p>과장 → 부장 승진</p>
                              <small>
                                처리자: 김인사 · 직급: 15호봉 → 16호봉
                              </small>
                            </div>
                          </div>
                        </div>
                      </article>

                      {/* 오른쪽: 휴직 신청 + 퇴직 처리 */}
                      <div className={styles.rightColumn}>
                        {/* 휴직 신청 */}
                        <article className={styles.card}>
                          <div className={styles.cardTitleRow}>
                            <div className={styles.cardTitle}>
                              <span
                                className={`${styles.cardIcon} ${styles.iconOrange}`}
                              >
                                📝
                              </span>
                              <h3>휴직 신청</h3>
                            </div>
                            <button
                              type="button"
                              className={styles.addHistoryBtn}
                            >
                              + 휴직 신청
                            </button>
                          </div>

                          <div className={styles.formGroup}>
                            <label>휴직 유형 선택</label>
                            <div className={styles.typeButtons}>
                              <button type="button" className={styles.typeBtn}>
                                병가
                              </button>
                              <button type="button" className={styles.typeBtn}>
                                육아휴직
                              </button>
                              <button type="button" className={styles.typeBtn}>
                                개인사유
                              </button>
                            </div>
                          </div>

                          <div className={styles.dateRow}>
                            <div className={styles.formGroup}>
                              <label>휴직 시작일</label>
                              <input type="date" className={styles.dateInput} />
                            </div>
                            <div className={styles.formGroup}>
                              <label>휴직 종료일 (예정)</label>
                              <input type="date" className={styles.dateInput} />
                            </div>
                          </div>

                          <div className={styles.formGroup}>
                            <label>휴직 사유 작성</label>
                            <textarea
                              className={styles.textarea}
                              placeholder="개인 사유를 구체적으로 작성해 주세요.&#10;예) 부모님 간병으로 인한 휴직 신청이며, 요양 기간 동안 한달 보수가 필요합니다."
                              rows={4}
                              maxLength={500}
                            />
                            <div className={styles.charCount}>0 / 500</div>
                          </div>
                        </article>

                        {/* 퇴직 처리 */}
                        <article className={styles.card}>
                          <div className={styles.cardTitle}>
                            <span
                              className={`${styles.cardIcon} ${styles.iconBlue}`}
                            >
                              📤
                            </span>
                            <h3>퇴직 처리</h3>
                          </div>

                          <div className={styles.dateRow}>
                            <div className={styles.formGroup}>
                              <label>퇴직 예정일</label>
                              <input type="date" className={styles.dateInput} />
                            </div>
                            <div className={styles.formGroup}>
                              <label>퇴직 사유</label>
                              <select className={styles.selectInput}>
                                <option value="">선택</option>
                                <option value="personal">개인 사유</option>
                                <option value="career">이직</option>
                                <option value="contract">계약 만료</option>
                                <option value="other">기타</option>
                              </select>
                            </div>
                          </div>

                          <button type="button" className={styles.retireBtn}>
                            퇴직 처리 진행
                          </button>
                        </article>
                      </div>
                    </div>
                  </div>
                )}

                {/* ===== 자격증·교육 탭 ===== */}
                {activeTab === "license" && (
                  <div className={styles.detailBody}>
                    {/* 상단 요약 카드 4개 */}
                    <div className={styles.summaryRow}>
                      <div className={styles.summaryCard}>
                        <div className={styles.summaryIconOrange}>📜</div>
                        <div>
                          <label>보유 면허 / 자격증</label>
                          <p>3건</p>
                        </div>
                      </div>
                      <div className={styles.summaryCard}>
                        <div className={styles.summaryIconGreen}>📖</div>
                        <div>
                          <label>이수 교육</label>
                          <p>12건</p>
                        </div>
                      </div>
                      <div className={styles.summaryCard}>
                        <div className={styles.summaryIconBlue}>⏳</div>
                        <div>
                          <label>이수 대기 교육</label>
                          <p>2건</p>
                        </div>
                      </div>
                      <div className={styles.summaryCard}>
                        <div className={styles.summaryIconPurple}>🔄</div>
                        <div>
                          <label>갱신 필요 자격</label>
                          <p>1건</p>
                        </div>
                      </div>
                    </div>

                    <div className={styles.historyLayout}>
                      {/* 왼쪽: 면허 / 자격증 목록 */}
                      <article className={styles.card}>
                        <div className={styles.cardTitleRow}>
                          <div className={styles.cardTitle}>
                            <span
                              className={`${styles.cardIcon} ${styles.iconOrange}`}
                            >
                              📜
                            </span>
                            <h3>면허 / 자격증 목록</h3>
                          </div>
                          <button
                            type="button"
                            className={styles.addHistoryBtn}
                          >
                            + 자격 추가
                          </button>
                        </div>

                        <div className={styles.certList}>
                          {/* 방사선사 면허 */}
                          <div className={styles.certItem}>
                            <div
                              className={`${styles.certIcon} ${styles.certOrange}`}
                            >
                              📜
                            </div>
                            <div className={styles.certContent}>
                              <div className={styles.certHeader}>
                                <strong>방사선사 면허</strong>
                                <span
                                  className={`${styles.certBadge} ${styles.badgeValid}`}
                                >
                                  유효
                                </span>
                              </div>
                              <p className={styles.certNo}>RAD-26-09821</p>
                              <div className={styles.certMeta}>
                                <span>취득 2019.01.15</span>
                                <span>발급 보건복지부</span>
                              </div>
                            </div>
                          </div>

                          {/* 전문방사선사 */}
                          <div className={styles.certItem}>
                            <div
                              className={`${styles.certIcon} ${styles.certGreen}`}
                            >
                              🏅
                            </div>
                            <div className={styles.certContent}>
                              <div className={styles.certHeader}>
                                <strong>전문방사선사</strong>
                                <span
                                  className={`${styles.certBadge} ${styles.badgeValid}`}
                                >
                                  유효
                                </span>
                              </div>
                              <p className={styles.certNo}>SRAD 2021-0447</p>
                              <div className={styles.certMeta}>
                                <span>취득 2021.06.10</span>
                                <span>발급 대한방사선사협회</span>
                              </div>
                            </div>
                          </div>

                          {/* 의료기기 안전관리 자격증 */}
                          <div className={styles.certItem}>
                            <div
                              className={`${styles.certIcon} ${styles.certPurple}`}
                            >
                              🔒
                            </div>
                            <div className={styles.certContent}>
                              <div className={styles.certHeader}>
                                <strong>의료기기 안전관리 자격증</strong>
                                <span
                                  className={`${styles.certBadge} ${styles.badgeExpire}`}
                                >
                                  갱신 필요
                                </span>
                              </div>
                              <p className={styles.certNo}>MEDS-2023-1193</p>
                              <div className={styles.certMeta}>
                                <span>취득 2020.03.22</span>
                                <span>만료 2025.03.21</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </article>

                      {/* 오른쪽: 교육 이수 목록 */}
                      <article className={styles.card}>
                        <div className={styles.cardTitleRow}>
                          <div className={styles.cardTitle}>
                            <span
                              className={`${styles.cardIcon} ${styles.iconGreen}`}
                            >
                              📖
                            </span>
                            <h3>교육 이수 목록</h3>
                          </div>
                          <div className={styles.eduActions}>
                            <div className={styles.eduFilters}>
                              <button
                                type="button"
                                className={styles.eduFilterActive}
                              >
                                전체
                              </button>
                              <button
                                type="button"
                                className={styles.eduFilterBtn}
                              >
                                이수완료
                              </button>
                              <button
                                type="button"
                                className={styles.eduFilterBtn}
                              >
                                대기중
                              </button>
                            </div>
                            <button
                              type="button"
                              className={styles.addHistoryBtn}
                            >
                              + 추가
                            </button>
                          </div>
                        </div>

                        <div className={styles.eduList}>
                          {/* 이수완료 */}
                          <div className={styles.eduItem}>
                            <div
                              className={`${styles.eduIcon} ${styles.eduGreen}`}
                            >
                              ✓
                            </div>
                            <div className={styles.eduContent}>
                              <div className={styles.eduHeader}>
                                <strong>방사선 피폭 안전관리 교육</strong>
                                <span
                                  className={`${styles.eduBadge} ${styles.eduDone}`}
                                >
                                  이수완료
                                </span>
                              </div>
                              <div className={styles.eduMeta}>
                                <span>2025.03.14 ~ 2025.03.15</span>
                                <span>8시간</span>
                                <span>한국방사선생명협회</span>
                              </div>
                            </div>
                            <div className={styles.eduScore}>
                              <strong>96점</strong>
                              <span>수료</span>
                            </div>
                          </div>

                          {/* 이수완료 */}
                          <div className={styles.eduItem}>
                            <div
                              className={`${styles.eduIcon} ${styles.eduGreen}`}
                            >
                              ✓
                            </div>
                            <div className={styles.eduContent}>
                              <div className={styles.eduHeader}>
                                <strong>의료기기 품질 관리 법정교육</strong>
                                <span
                                  className={`${styles.eduBadge} ${styles.eduDone}`}
                                >
                                  이수완료
                                </span>
                              </div>
                              <div className={styles.eduMeta}>
                                <span>2024.11.05 ~ 2024.11.06</span>
                                <span>16시간</span>
                                <span>의료기기안전원</span>
                              </div>
                            </div>
                            <div className={styles.eduScore}>
                              <strong>88점</strong>
                              <span>수료</span>
                            </div>
                          </div>

                          {/* 대기중 */}
                          <div className={styles.eduItem}>
                            <div
                              className={`${styles.eduIcon} ${styles.eduOrange}`}
                            >
                              ⏳
                            </div>
                            <div className={styles.eduContent}>
                              <div className={styles.eduHeader}>
                                <strong>인체조직 병리 특수검사 심화과정</strong>
                                <span
                                  className={`${styles.eduBadge} ${styles.eduPending}`}
                                >
                                  대기중
                                </span>
                              </div>
                              <div className={styles.eduMeta}>
                                <span>2025.08.20 ~ 2025.08.22</span>
                                <span>24시간</span>
                                <span>국립암센터 교육원</span>
                              </div>
                            </div>
                            <div className={styles.eduScore}>
                              <strong className={styles.scorePending}>
                                예정
                              </strong>
                            </div>
                          </div>

                          {/* 이수완료 */}
                          <div className={styles.eduItem}>
                            <div
                              className={`${styles.eduIcon} ${styles.eduPurple}`}
                            >
                              ✓
                            </div>
                            <div className={styles.eduContent}>
                              <div className={styles.eduHeader}>
                                <strong>AI 의료영상 분석 기초 과정</strong>
                                <span
                                  className={`${styles.eduBadge} ${styles.eduDone}`}
                                >
                                  이수완료
                                </span>
                              </div>
                              <div className={styles.eduMeta}>
                                <span>2024.07.10 ~ 2024.07.12</span>
                                <span>24시간</span>
                                <span>서울대 의과대학 연구소</span>
                              </div>
                            </div>
                            <div className={styles.eduScore}>
                              <strong>100점</strong>
                              <span>수료</span>
                            </div>
                          </div>
                        </div>
                      </article>
                    </div>
                  </div>
                )}

                {/* ===== 건강검진 탭 ===== */}
                {activeTab === "health" && (
                  <div className={styles.detailBody}>
                    {/* 상단 요약 카드 4개 */}
                    <div className={styles.summaryRow}>
                      <div className={styles.summaryCard}>
                        <div className={styles.summaryIconBlue}>📋</div>
                        <div>
                          <label>총 검진 횟수</label>
                          <p>5회</p>
                        </div>
                      </div>
                      <div className={styles.summaryCard}>
                        <div className={styles.summaryIconGreen}>📅</div>
                        <div>
                          <label>최근 검진일</label>
                          <p>2024.11.15</p>
                        </div>
                      </div>
                      <div className={styles.summaryCard}>
                        <div className={styles.summaryIconOrange}>🔔</div>
                        <div>
                          <label>다음 예정일</label>
                          <p>2025.11.15</p>
                        </div>
                      </div>
                      <div className={styles.summaryCard}>
                        <div className={styles.summaryIconPurple}>🛡</div>
                        <div>
                          <label>이상 소견</label>
                          <p className={styles.statusText}>정상</p>
                        </div>
                      </div>
                    </div>

                    <div className={styles.historyLayout}>
                      {/* 왼쪽: 건강검진 이력 */}
                      <article className={styles.card}>
                        <div className={styles.cardTitleRow}>
                          <div className={styles.cardTitle}>
                            <span
                              className={`${styles.cardIcon} ${styles.iconBlue}`}
                            >
                              📋
                            </span>
                            <h3>건강검진 이력</h3>
                          </div>
                          <button
                            type="button"
                            className={styles.addHistoryBtn}
                          >
                            + 검진 추가
                          </button>
                        </div>

                        <table className={styles.healthTable}>
                          <thead>
                            <tr>
                              <th>검진일</th>
                              <th>검진 종류</th>
                              <th>결과</th>
                              <th>주요 소견</th>
                              <th>처리</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>2024.11.15</td>
                              <td>일반 건강검진</td>
                              <td>
                                <span
                                  className={`${styles.healthResult} ${styles.resultNormal}`}
                                >
                                  정상
                                </span>
                              </td>
                              <td>이상 소견 없음</td>
                              <td>
                                <button
                                  type="button"
                                  className={styles.viewBtn}
                                  aria-label="상세 보기"
                                >
                                  👁
                                </button>
                              </td>
                            </tr>
                            <tr>
                              <td>2023.11.08</td>
                              <td>일반 건강검진</td>
                              <td>
                                <span
                                  className={`${styles.healthResult} ${styles.resultCaution}`}
                                >
                                  주의
                                </span>
                              </td>
                              <td>콜레스테롤 수치 경계</td>
                              <td>
                                <button
                                  type="button"
                                  className={styles.viewBtn}
                                  aria-label="상세 보기"
                                >
                                  👁
                                </button>
                              </td>
                            </tr>
                            <tr>
                              <td>2022.11.21</td>
                              <td>일반 건강검진</td>
                              <td>
                                <span
                                  className={`${styles.healthResult} ${styles.resultNormal}`}
                                >
                                  정상
                                </span>
                              </td>
                              <td>이상 소견 없음</td>
                              <td>
                                <button
                                  type="button"
                                  className={styles.viewBtn}
                                  aria-label="상세 보기"
                                >
                                  👁
                                </button>
                              </td>
                            </tr>
                            <tr>
                              <td>2021.10.19</td>
                              <td>특수 건강검진</td>
                              <td>
                                <span
                                  className={`${styles.healthResult} ${styles.resultNormal}`}
                                >
                                  정상
                                </span>
                              </td>
                              <td>방사선 피폭 이상 없음</td>
                              <td>
                                <button
                                  type="button"
                                  className={styles.viewBtn}
                                  aria-label="상세 보기"
                                >
                                  👁
                                </button>
                              </td>
                            </tr>
                            <tr>
                              <td>2020.11.03</td>
                              <td>일반 건강검진</td>
                              <td>
                                <span
                                  className={`${styles.healthResult} ${styles.resultNormal}`}
                                >
                                  정상
                                </span>
                              </td>
                              <td>이상 소견 없음</td>
                              <td>
                                <button
                                  type="button"
                                  className={styles.viewBtn}
                                  aria-label="상세 보기"
                                >
                                  👁
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </article>

                      {/* 오른쪽: 최근 검진 결과 + 다음 일정 */}
                      <div className={styles.rightColumn}>
                        {/* 최근 검진 결과 상세 */}
                        <article className={styles.card}>
                          <div className={styles.cardTitleRow}>
                            <div className={styles.cardTitle}>
                              <span
                                className={`${styles.cardIcon} ${styles.iconGreen}`}
                              >
                                ✅
                              </span>
                              <h3>최근 검진 결과 상세</h3>
                            </div>
                            <span className={styles.healthDateBadge}>
                              2024.11.15
                            </span>
                          </div>

                          <div className={styles.overallResult}>
                            <span className={styles.overallIcon}>🛡</span>
                            <div>
                              <strong>종합 판정: 정상 (A등급)</strong>
                            </div>
                          </div>

                          <table className={styles.resultTable}>
                            <thead>
                              <tr>
                                <th>검사 항목</th>
                                <th>결과값</th>
                                <th>정상 범위</th>
                                <th>판정</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>신장 / 체중</td>
                                <td>176cm / 74kg</td>
                                <td>-</td>
                                <td>
                                  <span className={styles.resultNormal}>
                                    정상
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td>혈압</td>
                                <td>118 / 76 mmHg</td>
                                <td>120/80 미만</td>
                                <td>
                                  <span className={styles.resultNormal}>
                                    정상
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td>혈당 (공복)</td>
                                <td>95 mg/dL</td>
                                <td>100 미만</td>
                                <td>
                                  <span className={styles.resultNormal}>
                                    정상
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td>총 콜레스테롤</td>
                                <td>188 mg/dL</td>
                                <td>200 미만</td>
                                <td>
                                  <span className={styles.resultNormal}>
                                    정상
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td>방사선 피폭량</td>
                                <td>2.1 mSv/년</td>
                                <td>20 mSv 이하</td>
                                <td>
                                  <span className={styles.resultNormal}>
                                    정상
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </article>

                        {/* 다음 검진 일정 */}
                        <article className={styles.card}>
                          <div className={styles.cardTitleRow}>
                            <div className={styles.cardTitle}>
                              <span
                                className={`${styles.cardIcon} ${styles.iconOrange}`}
                              >
                                📅
                              </span>
                              <h3>다음 검진 일정</h3>
                            </div>
                            <div className={styles.scheduleActions}>
                              <button
                                type="button"
                                className={styles.scheduleBtn}
                              >
                                일정 등록
                              </button>
                              <button
                                type="button"
                                className={styles.scheduleBtnOutline}
                              >
                                일정 수정
                              </button>
                            </div>
                          </div>

                          <div className={styles.nextSchedule}>
                            <div className={styles.scheduleDate}>
                              <span className={styles.scheduleIcon}>📅</span>
                              <div>
                                <strong>2025년 11월 15일 (토)</strong>
                                <p>일반 건강검진 · 원내 병원</p>
                              </div>
                            </div>
                            <p className={styles.scheduleNote}>
                              🔔 검진 30일 전 자동 알림 발송 예정
                            </p>
                          </div>
                        </article>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
