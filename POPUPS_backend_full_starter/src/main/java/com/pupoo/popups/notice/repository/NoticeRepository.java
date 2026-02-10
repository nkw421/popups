package com.pupoo.popups.notice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pupoo.popups.notice.domain.Notice;

public interface NoticeRepository extends JpaRepository<Notice, Long> {}
