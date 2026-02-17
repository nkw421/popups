package com.popups.pupoo.gallery.domain.model;
import java.sql.Date;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED) // JPA를 위해 기본 생성자는 필수!
@AllArgsConstructor
@Builder
@Table(name = "galleries") // SQL에 적힌 테이블 이름
@Entity
public class Gallery {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "gallery_id", nullable = false)
	private Long galleryId; // bigint는 자바에서 Long으로 써야 안전해!
	@Column(name = "event_id", nullable = false)
	private Long eventId; // 행사 ID
	@Column(name = "gallery_title", nullable = false)
	private String galleryTitle; // 갤러리 제목
	@Column(name = "description", length = 1000)
	private String description; // 사진 설명 (varchar(1000))
	@Column(name = "view_count")
	private Integer viewCount; // 조회수 (null 가능하니까 Integer)
	@Column(name = "thumbnail_image_id")
	private Long thumbnailImageId; // 대표 이미지 ID
	@Enumerated(EnumType.STRING) // ENUM을 문자로 저장하겠다는 마법!
	@Column(name = "gallery_status", nullable = false)
	@Builder.Default // 빌더 사용 시 기본값 설정
	private GalleryStatus galleryStatus = GalleryStatus.PUBLIC;
	@Column(name = "created_at", nullable = false, updatable = false)
	private Date createdAt; // 요즘은 Date보다 LocalDateTime을 많이 써!
	@Column(name = "updated_at", nullable = false)
	private Date updatedAt;
	// --- ENUM 정의 (별도 파일로 빼도 좋아) ---
	public enum GalleryStatus {
		PUBLIC, PRIVATE, BLINDED, DELETED
	}
	// --- 시간 자동 설정 마법 ---
	@PrePersist
	public void prePersist() {
		Date now = new Date(System.currentTimeMillis());
		if (this.createdAt == null)
			this.createdAt = now;
		if (this.updatedAt == null)
			this.updatedAt = now;
	}
	@PreUpdate
	public void preUpdate() {
		Date now = new Date(System.currentTimeMillis());
		this.updatedAt = now; // 수정될 때마다 현재 시간으로 갱신
	}
}
