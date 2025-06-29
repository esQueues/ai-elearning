package kz.sayat.diploma_backend.course_module.dto;

import lombok.Data;

@Data
public class QuizSummaryDto {
    private int id;
    private String title;
    private int moduleId;
    private int passingScore;
    private int durationInMinutes;
    private boolean passed;
    private int questionCount;
}
