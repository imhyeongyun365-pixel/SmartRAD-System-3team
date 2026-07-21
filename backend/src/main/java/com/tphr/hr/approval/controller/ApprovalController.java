package com.tphr.hr.approval.controller;

import com.tphr.hr.approval.dto.ApprovalDto;
import com.tphr.hr.approval.service.ApprovalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/approvals")
@RequiredArgsConstructor
public class ApprovalController {

    private final ApprovalService approvalService;

    /**
     * 1. 기안 문서 생성 (결재 올리기)
     */
    @PostMapping
    public ResponseEntity<ApprovalDto.Response> createDocument(@RequestBody ApprovalDto.CreateRequest request) {
        ApprovalDto.Response response = approvalService.createDocument(request);
        return ResponseEntity.ok(response);
    }

    /**
     * 2. 결재 승인
     * @param id 문서 ID
     * @param approverId 현재 승인하려는 사람의 사번 (실제로는 JWT Token에서 추출)
     */
    @PatchMapping("/{id}/approve")
    public ResponseEntity<ApprovalDto.Response> approveDocument(
            @PathVariable Long id,
            @RequestParam Long approverId) {
        // TODO: 향후 Spring Security 적용 시 @RequestParam 대신 @AuthenticationPrincipal 등으로 인증 정보 사용
        ApprovalDto.Response response = approvalService.approveDocument(id, approverId);
        return ResponseEntity.ok(response);
    }

    /**
     * 3. 결재 반려
     * @param id 문서 ID
     * @param approverId 반려하는 사람의 사번
     * @param reason 반려 사유
     */
    @PatchMapping("/{id}/reject")
    public ResponseEntity<ApprovalDto.Response> rejectDocument(
            @PathVariable Long id,
            @RequestParam Long approverId,
            @RequestParam String reason) {
        ApprovalDto.Response response = approvalService.rejectDocument(id, approverId, reason);
        return ResponseEntity.ok(response);
    }

    /**
     * 4. 결재 문서 상세 내역 조회
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApprovalDto.DetailResponse> getApprovalDetail(@PathVariable Long id) {
        ApprovalDto.DetailResponse response = approvalService.getApprovalDetail(id);
        return ResponseEntity.ok(response);
    }

    /**
     * 5. 결재 문서 삭제 (통과된 문서는 삭제 불가)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id) {
        approvalService.deleteDocument(id);
        return ResponseEntity.noContent().build();
    }
}
