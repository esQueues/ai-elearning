package kz.sayat.diploma_backend.course_module.dto;

import lombok.Data;
import java.util.List;

@Data
public class ModuleDto {
    private int id;
    private String title;
    private int courseId;
    private double progress;
    private List<QuizSummaryDto> quizzes;
    private List<LectureDto> lectures;
}

