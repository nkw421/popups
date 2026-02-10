package com.pupoo.popups.notice.domain;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="notices")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Notice {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
  private Long noticeId;

  @Column(nullable=false, length=200)
  private String title;

  @Column(columnDefinition="TEXT")
  private String content;

  @Column(nullable=false)
  private LocalDateTime createdAt;

  @PrePersist void prePersist() {
    if (createdAt==null) createdAt = LocalDateTime.now();
  }
}
