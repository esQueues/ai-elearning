package kz.sayat.diploma_backend.quiz_module.models;

import jakarta.persistence.*;
import kz.sayat.diploma_backend.auth_module.models.Student;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "attempts")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuizAttempt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "quiz_id")
    private Quiz quiz;

    private int attemptNumber;

    private double score;

    @OneToMany(mappedBy = "quizAttempt", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<QuizAttemptAnswer> attemptAnswers;

    @OneToMany(mappedBy = "quizAttempt", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Feedback> feedbackList;

    private boolean passed;

}
