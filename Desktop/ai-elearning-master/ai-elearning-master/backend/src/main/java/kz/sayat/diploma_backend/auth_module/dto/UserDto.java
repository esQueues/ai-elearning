package kz.sayat.diploma_backend.auth_module.dto;

import kz.sayat.diploma_backend.auth_module.models.enums.UserRole;
import lombok.Data;

@Data
public class UserDto {
    private int id;
    private String email;
    private String firstName;
    private String lastName;
    private UserRole userRole;
}
