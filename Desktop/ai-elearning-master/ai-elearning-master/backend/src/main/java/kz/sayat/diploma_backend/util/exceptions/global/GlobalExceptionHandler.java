package kz.sayat.diploma_backend.util.exceptions.global;

import jakarta.servlet.http.HttpServletRequest;
import kz.sayat.diploma_backend.util.exceptions.AuthException;
import kz.sayat.diploma_backend.util.exceptions.ResourceNotFoundException;
import kz.sayat.diploma_backend.util.exceptions.UnauthorizedException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.NoSuchElementException;

@RestControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /**
     * Handle validation errors (400 Bad Request)
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationException(MethodArgumentNotValidException ex, HttpServletRequest request) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
            errors.put(error.getField(), error.getDefaultMessage())
        );

        logger.warn("Validation error at {}: {}", request.getRequestURI(), errors);
        return buildResponse(HttpStatus.BAD_REQUEST, "Validation Error", errors, request);
    }

    /**
     * Handle AuthException (400 Bad Request)
     */
    @ExceptionHandler(AuthException.class)
    public ResponseEntity<Map<String, Object>> handleAuthException(AuthException ex, HttpServletRequest request) {
        logger.warn("Auth error at {}: {}", request.getRequestURI(), ex.getMessage());
        return buildResponse(HttpStatus.BAD_REQUEST, "Auth Error", ex.getMessage(), request);
    }

    /**
     * Handle BadCredentialsException (401 Unauthorized)
     */
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, Object>> handleBadCredentials(BadCredentialsException ex, HttpServletRequest request) {
        logger.warn("Authentication failed at {}: {}", request.getRequestURI(), ex.getMessage());
        return buildResponse(HttpStatus.UNAUTHORIZED, "Authentication Failed", "Invalid email or password", request);
    }

    /**
     * Handle UnauthorizedException (401 Unauthorized)
     */
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<Map<String, Object>> handleUnauthorizedException(UnauthorizedException ex, HttpServletRequest request) {
        logger.warn("Unauthorized access at {}: {}", request.getRequestURI(), ex.getMessage());
        return buildResponse(HttpStatus.UNAUTHORIZED, "Unauthorized", ex.getMessage(), request);
    }

    /**
     * Handle AuthenticationException (401 Unauthorized)
     * Used instead of CustomAuthenticationEntryPoint
     */
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Map<String, Object>> handleAuthenticationException(AuthenticationException ex, HttpServletRequest request) {
        logger.warn("Authentication required at {}: {}", request.getRequestURI(), ex.getMessage());
        return buildResponse(HttpStatus.UNAUTHORIZED, "Unauthorized", "Authenticate please to do this operation", request);
    }

    /**
     * Handle Resource Not Found (404 Not Found)
     */
    @ExceptionHandler({NoSuchElementException.class, ResourceNotFoundException.class})
    public ResponseEntity<Map<String, Object>> handleNotFoundException(Exception ex, HttpServletRequest request) {
        logger.warn("Resource not found at {}: {}", request.getRequestURI(), ex.getMessage());
        return buildResponse(HttpStatus.NOT_FOUND, "Not Found", ex.getMessage(), request);
    }

    /**
     * Handle all unexpected errors (500 Internal Server Error)
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGlobalException(Exception ex, HttpServletRequest request) {
        logger.error("Unexpected error at {}", request.getRequestURI(), ex);
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error", "An unexpected error occurred.", request);
    }

    /**
     * Helper method to build a consistent error response format
     */
    private ResponseEntity<Map<String, Object>> buildResponse(HttpStatus status, String error, Object message, HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", LocalDateTime.now());
        response.put("status", status.value());
        response.put("error", error);
        response.put("message", message);
        response.put("path", request.getRequestURI());
        return new ResponseEntity<>(response, status);
    }
}
