package kz.sayat.diploma_backend.quiz_module.dto;

import lombok.Data;
import java.util.List;

@Data
public class QuizSubmissionDto {
    private List<StudentAnswerDto> attemptAnswers;
    private int duration;
}