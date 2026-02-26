package com.popups.pupoo.user.config;

import com.popups.pupoo.user.domain.enums.RoleName;
import com.popups.pupoo.user.domain.enums.UserStatus;
import com.popups.pupoo.user.domain.model.User;
import com.popups.pupoo.user.persistence.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * 로컬 환경에서만 관리자 계정의 비밀번호 해시를 보정한다.
 * - seed에 평문/비정상 해시가 들어간 경우 로그인 불가 문제를 자동 복구
 */
@Component
@Profile("local")
public class LocalAdminAccountInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.local.admin.email:admin@pupoo.com}")
    private String adminEmail;

    @Value("${app.local.admin.password:admin1234}")
    private String adminPassword;

    public LocalAdminAccountInitializer(UserRepository userRepository,
                                        PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        userRepository.findByEmail(adminEmail)
                .ifPresentOrElse(this::ensureAdminPassword, this::createAdminUser);
    }

    private void ensureAdminPassword(User user) {
        boolean looksBcrypt = user.getPassword() != null && user.getPassword().startsWith("$2");
        boolean matches = looksBcrypt && passwordEncoder.matches(adminPassword, user.getPassword());

        if (!matches) {
            user.setPassword(passwordEncoder.encode(adminPassword));
            user.setRoleName(RoleName.ADMIN);
            user.setStatus(UserStatus.ACTIVE);
            user.setEmailVerified(true);
            user.setPhoneVerified(true);
            userRepository.save(user);
        }
    }

    private void createAdminUser() {
        User user = new User();
        user.setEmail(adminEmail);
        user.setPassword(passwordEncoder.encode(adminPassword));
        user.setNickname("푸푸관리자");
        user.setPhone("010-1001-1007");
        user.setRoleName(RoleName.ADMIN);
        user.setStatus(UserStatus.ACTIVE);
        user.setShowAge(true);
        user.setShowGender(false);
        user.setShowPet(true);
        user.setEmailVerified(true);
        user.setPhoneVerified(true);
        userRepository.save(user);
    }
}
