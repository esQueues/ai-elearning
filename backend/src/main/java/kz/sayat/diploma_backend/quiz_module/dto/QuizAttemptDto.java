package kz.sayat.diploma_backend.quiz_module.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuizAttemptDto {
    private int attemptId;
    private int studentId;
    private int quizId;
    private int attemptNumber;
    private double score;
    private boolean passed;
    private int durationSeconds;
}
