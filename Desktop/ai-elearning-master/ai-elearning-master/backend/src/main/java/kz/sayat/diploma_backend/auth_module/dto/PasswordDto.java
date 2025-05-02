package kz.sayat.diploma_backend.auth_module.dto;

import lombok.Data;

@Data
public class PasswordDto {
    private String oldPassword;
    private String newPassword;
}
