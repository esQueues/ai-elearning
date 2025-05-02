package kz.sayat.diploma_backend.quiz_module.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "feedbacks")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(columnDefinition = "TEXT")
    private String promptText;
    @Column(columnDefinition = "TEXT")
    private String feedbackText;

    @ManyToOne
    @JoinColumn(name = "attempt_id", nullable = false)
    private QuizAttempt quizAttempt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Feedback(String promptText, String feedbackText, QuizAttempt attempt) {
        this.promptText = promptText;
        this.feedbackText = feedbackText;
        this.quizAttempt = attempt;
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }
}
