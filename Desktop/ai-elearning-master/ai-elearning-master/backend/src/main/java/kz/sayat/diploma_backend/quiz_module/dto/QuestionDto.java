package kz.sayat.diploma_backend.quiz_module.dto;

import lombok.Data;

import java.util.List;

@Data
public class QuestionDto {
    private int id;
    private String questionText;
    private int quizId;
    private List<AnswerDto> answers;
}
