package kz.sayat.diploma_backend.auth_module.service.implementation;

import kz.sayat.diploma_backend.auth_module.dto.VerificationCodeData;
import kz.sayat.diploma_backend.util.exceptions.AuthException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class EmailService {

    private final Map<String, VerificationCodeData> verificationCodes = new ConcurrentHashMap<>();
    private final JavaMailSender mailSender;

    @Value("${mailtrap.from}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendEmailVerificationCode(String email) {
        if (!isEmailFormatValid(email)) {
            throw new AuthException("Некорректный email");
        }

        String code = generateCode();
        verificationCodes.put(email, new VerificationCodeData(code, LocalDateTime.now().plusMinutes(10)));

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(email);
        message.setSubject("Код подтверждения email");
        message.setText("Ваш код подтверждения: " + code);
        try {
            mailSender.send(message);
            System.out.println("Код отправлен на email: " + email);
        } catch (Exception e) {
            throw new AuthException("Не удалось отправить email: " + e.getMessage());
        }
    }

    private String generateCode() {
        return String.valueOf((int)(Math.random() * 900000) + 100000); // 6-значный код
    }

    private boolean isEmailFormatValid(String email) {
        return email != null && email.matches("^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$");
    }

    public boolean verifyEmailCode(String email, String inputCode) {
        VerificationCodeData data = verificationCodes.get(email);
        if (data == null) {
            return false;
        }

        if (data.getExpiresAt().isBefore(LocalDateTime.now())) {
            verificationCodes.remove(email);
            return false;
        }

        boolean match = data.getCode().equals(inputCode);
        if (match) {
            verificationCodes.remove(email);
        }

        return match;
    }
}