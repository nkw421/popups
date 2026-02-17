package com.popups.pupoo.notice.domain.model;
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
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Table(name = "notices") // SQL 명세에 맞춰 복수형(notices)으로 수정!
@Entity
public class Notice {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   @Column(name = "notice_id", nullable = false)
   private Long noticeId; // bigint -> Long
   @Column(name = "scope", nullable = false, length = 20)
   private String scope;
   @Column(name = "event_id")
   private Long eventId; // bigint -> Long (null 허용이므로 기본형보다 참조형 추천)
   @Column(name = "notice_title", nullable = false)
   private String noticeTitle;
   @Column(name = "content", nullable = false, length = 1000)
   private String content;
   @Enumerated(EnumType.STRING)
   @Column(name = "file_attached", nullable = false)
   @Builder.Default
   private FileAttached fileAttached = FileAttached.N; // 기본값 'N'
   @Column(name = "is_pinned", nullable = false)
   private boolean isPinned; // tinyint(1)은 자바의 boolean과 매핑돼!
   @Enumerated(EnumType.STRING)
   @Column(name = "status", nullable = false)
   private NoticeStatus status;
   @Column(name = "created_by_admin_id", nullable = false)
   private Long createdByAdminId; // 관리자 ID도 Long으로!
   @Column(name = "created_at", nullable = false, updatable = false)
   private Date createdAt;
   @Column(name = "updated_at", nullable = false)
   private Date updatedAt;
   // --- ENUM 정의 ---
   public enum FileAttached { Y, N }
   public enum NoticeStatus { PUBLISHED, DRAFT, HIDDEN }
   // --- 시간 자동 설정 마법 ---
   @PrePersist
   public void prePersist() {
		Date now = new Date(System.currentTimeMillis());
       if (this.createdAt == null) this.createdAt = now;
       if (this.updatedAt == null) this.updatedAt = now;
   }
   @PreUpdate
   public void preUpdate() {
		Date now = new Date(System.currentTimeMillis());
       this.updatedAt = now;
   }
}

