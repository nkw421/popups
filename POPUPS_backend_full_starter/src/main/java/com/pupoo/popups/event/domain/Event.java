package com.pupoo.popups.event.domain;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="events")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Event {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
  private Long eventId;

  @Column(nullable=false, length=150)
  private String eventName;

  @Column(columnDefinition="TEXT")
  private String description;

  private LocalDateTime startAt;
  private LocalDateTime endAt;

  @PrePersist void prePersist() {
    if (startAt==null) startAt = LocalDateTime.now().plusDays(7);
    if (endAt==null) endAt = startAt.plusHours(8);
  }
}
