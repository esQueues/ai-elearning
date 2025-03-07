package kz.sayat.diploma_backend.quiz_module.dto;

import lombok.Data;

@Data
public class GradeDto {
    private int studentId;
    private int quizId;
    private int attemptNumber;
    private double score;
}
