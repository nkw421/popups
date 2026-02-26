package com.popups.pupoo;

import com.popups.pupoo.payment.infrastructure.KakaoPayProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(KakaoPayProperties.class)
public class PupooBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(PupooBackendApplication.class, args);
	}
}
/* 

**2. SQL 시드 데이터** — users INSERT에서 user_id=1 비밀번호 해시만 변경:

변경 전:
```
'$2a$10$abcdefghijklmnopqrstuv'
```

변경 후:
```
'$2a$10$9SFUWtS0qjzjRdZXSQbGPeEaAHjmxHbdTuSb/TxPLu.sNqJfuix6K'

*/