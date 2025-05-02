package kz.sayat.diploma_backend.quiz_module.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class QuizAttemptDto {
    private int attemptId;
    private int studentId;
    private int quizId;
    private int attemptNumber;
    private double score;
    private boolean passed;
}
