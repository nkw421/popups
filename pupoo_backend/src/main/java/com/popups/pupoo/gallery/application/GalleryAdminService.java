// file: src/main/java/com/popups/pupoo/gallery/application/GalleryAdminService.java
package com.popups.pupoo.gallery.application;

import com.popups.pupoo.common.audit.application.AdminLogService;
import com.popups.pupoo.common.audit.domain.enums.AdminTargetType;
import com.popups.pupoo.common.exception.BusinessException;
import com.popups.pupoo.common.exception.ErrorCode;
import com.popups.pupoo.gallery.domain.enums.GalleryStatus;
import com.popups.pupoo.gallery.domain.model.Gallery;
import com.popups.pupoo.gallery.domain.model.GalleryImage;
import com.popups.pupoo.gallery.dto.GalleryCreateRequest;
import com.popups.pupoo.gallery.dto.GalleryResponse;
import com.popups.pupoo.gallery.dto.GalleryUpdateRequest;
import com.popups.pupoo.gallery.persistence.GalleryImageRepository;
import com.popups.pupoo.gallery.persistence.GalleryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GalleryAdminService {

    private final GalleryRepository galleryRepository;
    private final GalleryImageRepository galleryImageRepository;
    private final AdminLogService adminLogService;

    /**
     * 관리자 갤러리 등록
     * - user_id에 현재 관리자 ID를 저장(DB NOT NULL 대응)
     * - description 필드는 gallery_description 기준으로 저장
     */
    @Transactional
    public GalleryResponse create(Long adminUserId, GalleryCreateRequest request) {
        Gallery g = Gallery.builder()
                .eventId(request.getEventId())
                .userId(adminUserId)
                .galleryTitle(request.getTitle())
                .gallery_description(request.getDescription()) // ✅ description -> gallery_description
                .viewCount(0)
                .thumbnailImageId(null)
                .galleryStatus(GalleryStatus.PUBLIC)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Gallery saved = galleryRepository.save(g);

        adminLogService.write("GALLERY_CREATE", AdminTargetType.OTHER, saved.getGalleryId());

        List<String> urls = request.getImageUrls() == null ? List.of() : request.getImageUrls();
        Long firstImageId = saveImagesAndGetFirstId(saved, urls);

        if (firstImageId != null) {
            saved = galleryRepository.save(saved.toBuilder()
                    .thumbnailImageId(firstImageId)
                    .updatedAt(LocalDateTime.now())
                    .build());
        }

        return buildResponse(saved, urls);
    }

    /**
     * 회원이 자신의 갤러리 작성
     * - user_id에 현재 사용자 저장
     * - description 필드는 gallery_description 기준으로 저장
     */
    @Transactional
    public GalleryResponse createByUser(Long userId, GalleryCreateRequest request) {
        Gallery g = Gallery.builder()
                .eventId(request.getEventId())
                .userId(userId)
                .galleryTitle(request.getTitle())
                .gallery_description(request.getDescription()) // ✅ description -> gallery_description
                .viewCount(0)
                .thumbnailImageId(null)
                .galleryStatus(GalleryStatus.PUBLIC)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Gallery saved = galleryRepository.save(g);

        List<String> urls = request.getImageUrls() == null ? List.of() : request.getImageUrls();
        Long firstImageId = saveImagesAndGetFirstId(saved, urls);

        if (firstImageId != null) {
            saved = galleryRepository.save(saved.toBuilder()
                    .thumbnailImageId(firstImageId)
                    .updatedAt(LocalDateTime.now())
                    .build());
        }

        return buildResponse(saved, urls);
    }

    /**
     * 관리자 수정
     * - description 필드는 gallery_description 기준으로 수정
     */
    @Transactional
    public GalleryResponse update(Long galleryId, GalleryUpdateRequest request) {
        Gallery g = galleryRepository.findById(galleryId)
                .orElseThrow(() -> new IllegalArgumentException("갤러리가 존재하지 않습니다."));

        Gallery updated = galleryRepository.save(g.toBuilder()
                .galleryTitle(request.getTitle())
                .gallery_description(request.getDescription()) // ✅ description -> gallery_description
                .updatedAt(LocalDateTime.now())
                .build());

        adminLogService.write("GALLERY_UPDATE", AdminTargetType.OTHER, galleryId);

        List<String> urls = galleryImageRepository.findAllByGallery_GalleryIdOrderByImageOrderAsc(galleryId)
                .stream()
                .map(GalleryImage::getOriginalUrl)
                .toList();

        return buildResponse(updated, urls);
    }

    /**
     * 작성자 본인 또는 관리자만 수정 가능
     * - user_id가 null인 갤러리(관리자 등록)는 관리자만 수정 가능
     * - description 필드는 gallery_description 기준으로 수정
     */
    @Transactional
    public GalleryResponse updateByAuthorOrAdmin(
            Long galleryId,
            GalleryUpdateRequest request,
            Long currentUserId,
            boolean isAdmin
    ) {
        Gallery g = galleryRepository.findById(galleryId)
                .orElseThrow(() -> new IllegalArgumentException("갤러리가 존재하지 않습니다."));

        if (!isAdmin) {
            if (g.getUserId() == null || !g.getUserId().equals(currentUserId)) {
                throw new BusinessException(ErrorCode.FORBIDDEN, "수정 권한이 없습니다.");
            }
        }

        Gallery updated = galleryRepository.save(g.toBuilder()
                .galleryTitle(request.getTitle())
                .gallery_description(request.getDescription()) // ✅ description -> gallery_description
                .updatedAt(LocalDateTime.now())
                .build());

        if (isAdmin) {
            adminLogService.write("GALLERY_UPDATE", AdminTargetType.OTHER, galleryId);
        }

        List<String> urls = galleryImageRepository.findAllByGallery_GalleryIdOrderByImageOrderAsc(galleryId)
                .stream()
                .map(GalleryImage::getOriginalUrl)
                .toList();

        return buildResponse(updated, urls);
    }

    /**
     * 관리자 삭제 (소프트 삭제)
     * - DB 정책: 하드 삭제 금지 → 상태 전환으로 soft delete 처리
     */
    @Transactional
    public void delete(Long galleryId) {
        Gallery g = galleryRepository.findById(galleryId)
                .orElseThrow(() -> new IllegalArgumentException("갤러리가 존재하지 않습니다."));

        galleryRepository.save(g.toBuilder()
                .galleryStatus(GalleryStatus.DELETED)
                .updatedAt(LocalDateTime.now())
                .build());

        adminLogService.write("GALLERY_DELETE", AdminTargetType.OTHER, galleryId);
    }

    /**
     * 작성자 본인 또는 관리자만 삭제(소프트 삭제) 가능
     * - user_id가 null인 갤러리는 관리자만 삭제 가능
     */
    @Transactional
    public void deleteByAuthorOrAdmin(Long galleryId, Long currentUserId, boolean isAdmin) {
        Gallery g = galleryRepository.findById(galleryId)
                .orElseThrow(() -> new IllegalArgumentException("갤러리가 존재하지 않습니다."));

        if (!isAdmin) {
            if (g.getUserId() == null || !g.getUserId().equals(currentUserId)) {
                throw new BusinessException(ErrorCode.FORBIDDEN, "삭제 권한이 없습니다.");
            }
        }

        galleryRepository.save(g.toBuilder()
                .galleryStatus(GalleryStatus.DELETED)
                .updatedAt(LocalDateTime.now())
                .build());

        if (isAdmin) {
            adminLogService.write("GALLERY_DELETE", AdminTargetType.OTHER, galleryId);
        }
    }

    // -----------------------
    // private helpers
    // -----------------------

    private Long saveImagesAndGetFirstId(Gallery saved, List<String> urls) {
        int order = 1;
        Long firstImageId = null;

        for (String url : urls) {
            GalleryImage img = GalleryImage.builder()
                    .gallery(saved)
                    .originalUrl(url)
                    .thumbUrl(null)
                    .imageOrder(order++)
                    .mimeType(null)
                    .fileSize(null)
                    .createdAt(LocalDateTime.now())
                    .build();

            GalleryImage savedImg = galleryImageRepository.save(img);
            if (firstImageId == null) {
                firstImageId = savedImg.getImageId();
            }
        }
        return firstImageId;
    }

    private GalleryResponse buildResponse(Gallery g, List<String> urls) {
        return GalleryResponse.builder()
                .galleryId(g.getGalleryId())
                .eventId(g.getEventId())
                .userId(g.getUserId())
                .title(g.getGalleryTitle())
                // ✅ description은 gallery_description에서 읽어야 함
                .description(g.getGallery_description()) // <-- 엔티티 getter가 이 이름이어야 가장 정상
                .viewCount(g.getViewCount())
                .thumbnailImageId(g.getThumbnailImageId())
                .status(g.getGalleryStatus())
                .imageUrls(urls)
                .createdAt(g.getCreatedAt())
                .updatedAt(g.getUpdatedAt())
                .build();
    }
}