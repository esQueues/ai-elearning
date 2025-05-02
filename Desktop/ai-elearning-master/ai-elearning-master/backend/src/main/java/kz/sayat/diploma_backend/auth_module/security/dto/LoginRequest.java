package kz.sayat.diploma_backend.auth_module.security.dto;

public record LoginRequest(
     String email,
     String password
){}
