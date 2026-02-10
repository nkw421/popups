package com.pupoo.popups.event.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pupoo.popups.event.domain.Event;

public interface EventRepository extends JpaRepository<Event, Long> {}
