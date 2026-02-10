package com.pupoo.popups.user.domain;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users", indexes = { @Index(name="idx_users_email", columnList="email", unique=true) })
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
  private Long userId;

  @Column(nullable=false, length=120, unique=true)
  private String email;

  @Column(nullable=false, length=255)
  private String password;

  @Column(nullable=false, length=50)
  private String nickname;

  @Enumerated(EnumType.STRING)
  @Column(nullable=false, length=10)
  private Role role;

  @Column(nullable=false)
  private LocalDateTime createdAt;

  @PrePersist void prePersist() {
    if (createdAt==null) createdAt = LocalDateTime.now();
    if (role==null) role = Role.USER;
  }
}
