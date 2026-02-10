package com.pupoo.popups.auth.domain;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="refresh_tokens", indexes={
  @Index(name="idx_refresh_user", columnList="userId"),
  @Index(name="idx_refresh_token", columnList="token", unique=true)
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RefreshToken {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
  private Long refreshTokenId;

  @Column(nullable=false)
  private Long userId;

  @Column(nullable=false, length=500, unique=true)
  private String token;

  @Column(nullable=false)
  private LocalDateTime expiresAt;

  @Column(nullable=false)
  private LocalDateTime createdAt;

  @PrePersist void prePersist() {
    if (createdAt==null) createdAt = LocalDateTime.now();
  }
}
