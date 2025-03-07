package kz.sayat.diploma_backend.quiz_module.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FeedbackDto {
    private int id;
    private String feedbackText;
    private String studentFirstname;
    private String studentLastname;
    private String courseTitle;
    private String quizTitle;
    private String attemptTime;
}
