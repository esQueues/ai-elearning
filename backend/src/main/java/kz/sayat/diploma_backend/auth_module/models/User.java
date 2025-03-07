package kz.sayat.diploma_backend.auth_module.models;

import jakarta.persistence.*;
import kz.sayat.diploma_backend.auth_module.models.enums.UserRole;
import lombok.*;

import java.time.LocalDateTime;

@Table(name = "users")
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Inheritance(strategy = InheritanceType.JOINED)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String email;
    private String password;

    @Enumerated(EnumType.STRING)
    private UserRole role;
    private String firstname;

    private String lastname;
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

}
