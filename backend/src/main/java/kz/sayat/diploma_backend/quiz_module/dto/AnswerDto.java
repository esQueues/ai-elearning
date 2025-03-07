package kz.sayat.diploma_backend.quiz_module.dto;

import lombok.Data;

@Data
public class AnswerDto {
    private int id;
    private String answerText;
    private boolean isCorrect;
}
