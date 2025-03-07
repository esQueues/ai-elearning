package kz.sayat.diploma_backend.auth_module.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import kz.sayat.diploma_backend.auth_module.security.dto.LoginRequest;
import kz.sayat.diploma_backend.auth_module.security.dto.RegisterRequest;
import kz.sayat.diploma_backend.auth_module.dto.UserDto;
import kz.sayat.diploma_backend.auth_module.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<UserDto> login(HttpServletRequest request,
                                         HttpServletResponse response,
                                         @RequestBody LoginRequest authRequest) {
        return ResponseEntity.ok().body(authService.login(request, response, authRequest));
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public void register(@RequestBody @Valid RegisterRequest registerRequest) {
        authService.register(registerRequest);
    }

    @PostMapping("/register/teacher")
    @ResponseStatus(HttpStatus.CREATED)
    public void registerTeacher(@RequestBody @Valid RegisterRequest registerRequest) {
        authService.registerTeacher(registerRequest);
    }

    @GetMapping("/check-session")
    public ResponseEntity<?> checkSession(HttpServletRequest request) {
        return (request.getSession(false) != null)
            ? ResponseEntity.ok().build()
            : ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @GetMapping("/user")
    public ResponseEntity<Map<String, String>> getUserRole(Authentication authentication) {
        return ResponseEntity.ok(authService.giveRole(authentication));
    }
}






