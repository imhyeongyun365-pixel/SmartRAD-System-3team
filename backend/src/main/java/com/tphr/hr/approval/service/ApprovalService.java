package com.tphr.hr.approval.service;

import com.tphr.hr.approval.dto.ApprovalDto;
import com.tphr.hr.approval.entity.ApprovalAttachment;
import com.tphr.hr.approval.entity.ApprovalDocument;
import com.tphr.hr.approval.entity.ApprovalLine;
import com.tphr.hr.approval.repository.ApprovalAttachmentRepository;
import com.tphr.hr.approval.repository.ApprovalDocumentRepository;
import com.tphr.hr.approval.repository.ApprovalLineRepository;
import com.tphr.hr.employee.entity.Employee;
import com.tphr.hr.system.entity.CommonCode;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ApprovalService {

    private final ApprovalDocumentRepository approvalDocumentRepository;
    private final ApprovalLineRepository approvalLineRepository;
    private final ApprovalAttachmentRepository approvalAttachmentRepository;
    private final EntityManager entityManager;

    /**
     * 1. 문서 기안 (Create Document)
     */
    @Transactional
    public ApprovalDto.Response createDocument(ApprovalDto.CreateRequest request) {
        // 프록시 객체로 조회 (Repository 없이 FK만 맵핑)
        Employee drafter = entityManager.getReference(Employee.class, request.getDraftedById());
        CommonCode docType = entityManager.getReference(CommonCode.class, request.getDocTypeCode());

        // 1-1. 문서 번호 생성 (예: APP-20260720-UUID)
        String docNumber = "APP-" + LocalDateTime.now().getYear() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        // 1-2. 원본 문서 저장
        ApprovalDocument document = ApprovalDocument.builder()
                .docNumber(docNumber)
                .title(request.getTitle())
                .docType(docType)
                .content(request.getContent())
                .draftedBy(drafter)
                .status("IN_PROGRESS") // 기안 즉시 진행 중으로 상태 변경
                .build();
        ApprovalDocument savedDocument = approvalDocumentRepository.save(document);

        // 1-3. 결재선 저장 (순차적으로)
        List<ApprovalLine> lines = new ArrayList<>();
        List<Long> approverIds = request.getApproverIds();
        for (int i = 0; i < approverIds.size(); i++) {
            Employee approver = entityManager.getReference(Employee.class, approverIds.get(i));
            String initialStatus = (i == 0) ? "WAITING" : "PENDING"; // 첫 번째 결재자만 대기 상태

            ApprovalLine line = ApprovalLine.builder()
                    .document(savedDocument)
                    .sequence(i + 1)
                    .approver(approver)
                    .status(initialStatus)
                    .build();
            lines.add(line);
        }
        approvalLineRepository.saveAll(lines);

        // 1-4. 첨부파일(메타데이터) 저장
        if (request.getAttachmentFileNames() != null) {
            List<ApprovalAttachment> attachments = request.getAttachmentFileNames().stream()
                    .map(fileName -> ApprovalAttachment.builder()
                            .document(savedDocument)
                            .fileName(fileName)
                            .filePath("/mock-storage/" + fileName) // Mock 경로
                            .fileSizeKb(1024) // 임의 사이즈
                            .build())
                    .collect(Collectors.toList());
            approvalAttachmentRepository.saveAll(attachments);
        }

        return mapToResponse(savedDocument);
    }

    /**
     * 2. 결재 승인
     */
    @Transactional
    public ApprovalDto.Response approveDocument(Long documentId, Long approverId) {
        ApprovalDocument document = approvalDocumentRepository.findById(documentId)
                .orElseThrow(() -> new IllegalArgumentException("문서를 찾을 수 없습니다."));
        
        List<ApprovalLine> lines = approvalLineRepository.findByDocumentIdOrderBySequenceAsc(documentId);
        
        ApprovalLine currentLine = lines.stream()
                .filter(line -> line.getApprover().getId().equals(approverId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("해당 문서의 결재자가 아닙니다."));

        if (!"WAITING".equals(currentLine.getStatus())) {
            throw new IllegalStateException("현재 결재할 차례가 아닙니다.");
        }

        currentLine.approve(); // JPA 더티 체킹

        int nextSequenceIndex = lines.indexOf(currentLine) + 1;
        if (nextSequenceIndex < lines.size()) {
            ApprovalLine nextLine = lines.get(nextSequenceIndex);
            nextLine.markAsWaiting();
        } else {
            document.updateStatus("COMPLETED");
        }

        return mapToResponse(document);
    }

    /**
     * 3. 결재 반려
     */
    @Transactional
    public ApprovalDto.Response rejectDocument(Long documentId, Long approverId, String reason) {
        ApprovalDocument document = approvalDocumentRepository.findById(documentId)
                .orElseThrow(() -> new IllegalArgumentException("문서를 찾을 수 없습니다."));

        ApprovalLine currentLine = approvalLineRepository.findByDocumentIdAndApproverId(documentId, approverId)
                .orElseThrow(() -> new IllegalArgumentException("해당 문서의 결재자가 아닙니다."));

        if (!"WAITING".equals(currentLine.getStatus())) {
            throw new IllegalStateException("현재 결재할 차례가 아닙니다.");
        }

        currentLine.reject(reason);
        document.updateStatus("REJECTED");

        return mapToResponse(document);
    }

    /**
     * 4. 문서 상세 조회
     */
    @Transactional(readOnly = true)
    public ApprovalDto.DetailResponse getApprovalDetail(Long documentId) {
        ApprovalDocument document = approvalDocumentRepository.findById(documentId)
                .orElseThrow(() -> new IllegalArgumentException("문서를 찾을 수 없습니다."));
        
        List<ApprovalLine> lines = approvalLineRepository.findByDocumentIdOrderBySequenceAsc(documentId);
        List<ApprovalAttachment> attachments = approvalAttachmentRepository.findByDocumentId(documentId);

        List<ApprovalDto.LineResponse> lineResponses = lines.stream().map(line ->
                ApprovalDto.LineResponse.builder()
                        .id(line.getId())
                        .sequence(line.getSequence())
                        .approverName(line.getApprover().getName())
                        .status(line.getStatus())
                        .approvedAt(line.getApprovedAt())
                        .rejectReason(line.getRejectReason())
                        .build()
        ).collect(Collectors.toList());

        List<ApprovalDto.AttachmentResponse> attachmentResponses = attachments.stream().map(att ->
                ApprovalDto.AttachmentResponse.builder()
                        .id(att.getId())
                        .fileName(att.getFileName())
                        .filePath(att.getFilePath())
                        .fileSizeKb(att.getFileSizeKb())
                        .build()
        ).collect(Collectors.toList());

        return ApprovalDto.DetailResponse.builder()
                .document(mapToResponse(document))
                .content(document.getContent())
                .approvalLines(lineResponses)
                .attachments(attachmentResponses)
                .build();
    }

    /**
     * 5. 결재 문서 삭제 (통과(COMPLETED)되지 않은 문서만)
     */
    @Transactional
    public void deleteDocument(Long documentId) {
        ApprovalDocument document = approvalDocumentRepository.findById(documentId)
                .orElseThrow(() -> new IllegalArgumentException("문서를 찾을 수 없습니다."));

        if ("COMPLETED".equals(document.getStatus())) {
            throw new IllegalStateException("이미 최종 승인 완료된 문서는 삭제할 수 없습니다.");
        }

        approvalLineRepository.deleteByDocumentId(documentId);
        approvalAttachmentRepository.deleteByDocumentId(documentId);
        approvalDocumentRepository.delete(document);
    }

    // --- Helper Methods ---

    private ApprovalDto.Response mapToResponse(ApprovalDocument doc) {
        return ApprovalDto.Response.builder()
                .id(doc.getId())
                .docNumber(doc.getDocNumber())
                .title(doc.getTitle())
                .docTypeName(doc.getDocType().getName())
                .draftedByName(doc.getDraftedBy().getName())
                .status(doc.getStatus())
                .createdAt(doc.getCreatedAt())
                .build();
    }
}
