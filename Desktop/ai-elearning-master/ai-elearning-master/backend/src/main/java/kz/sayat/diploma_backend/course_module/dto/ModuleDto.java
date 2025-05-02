package kz.sayat.diploma_backend.course_module.dto;

import kz.sayat.diploma_backend.quiz_module.dto.QuizDto;
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

