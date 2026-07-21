package com.tphr.hr.approval.repository;

import com.tphr.hr.approval.entity.ApprovalAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApprovalAttachmentRepository extends JpaRepository<ApprovalAttachment, Long> {
    
    // 특정 문서의 첨부파일 목록 조회
    List<ApprovalAttachment> findByDocumentId(Long documentId);

    // 특정 문서의 첨부파일 모두 삭제
    void deleteByDocumentId(Long documentId);
}
