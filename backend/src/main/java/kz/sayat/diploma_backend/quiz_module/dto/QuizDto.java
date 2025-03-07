package kz.sayat.diploma_backend.quiz_module.dto;

import lombok.Data;

import java.util.List;

@Data
public class QuizDto {
    private int id;
    private String title;
    private int passingScore;
    private int courseId;
    private int moduleId;
    private List<QuestionDto> questions;
}
