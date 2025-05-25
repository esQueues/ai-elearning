package kz.sayat.diploma_backend.auth_module;

import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import kz.sayat.diploma_backend.auth_module.dto.VerificationCodeData;
import kz.sayat.diploma_backend.util.exceptions.AuthException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class EmailService {

    @Value("${spring.sendgrid.api-key}")
    private String sendGridApiKey;

    public void sendEmailVerificationCode(String email) {
        if (!isEmailFormatValid(email)) {
            throw new AuthException("Некорректный email");
        }

        String code = generateCode();
        verificationCodes.put(email, new VerificationCodeData(code, LocalDateTime.now().plusMinutes(10)));

        // Configure SendGrid email
        Email from = new Email("your-verified-sender-email@domain.com"); // Replace with your verified sender email
        Email to = new Email(email);
        String subject = "Код подтверждения email";
        Content content = new Content("text/plain", "Ваш код подтверждения: " + code);
        Mail mail = new Mail(from, subject, to, content);

        // Initialize SendGrid client
        SendGrid sendGrid = new SendGrid(sendGridApiKey);
        Request request = new Request();

        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sendGrid.api(request);

            if (response.getStatusCode() >= 200 && response.getStatusCode() < 300) {
                System.out.println("Код отправлен на email: " + email);
            } else {
                throw new RuntimeException("Failed to send email: " + response.getBody());
            }
        } catch (Exception e) {
            throw new RuntimeException("Error sending email: " + e.getMessage());
        }
    }

    private boolean isEmailFormatValid(String email) {
        // Your existing email validation logic
        return email != null && email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");
    }

    private String generateCode() {
        // Your existing code generation logic
        return String.valueOf((int) (Math.random() * 9000) + 1000); // Example: 4-digit code
    }
}}