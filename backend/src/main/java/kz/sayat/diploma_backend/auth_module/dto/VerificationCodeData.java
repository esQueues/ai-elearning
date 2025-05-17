package kz.sayat.diploma_backend.auth_module.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class VerificationCodeData {

    private final String code;
    private final LocalDateTime expiresAt;

    public VerificationCodeData(String code, LocalDateTime expiresAt) {
        this.code = code;
        this.expiresAt = expiresAt;
    }


}
