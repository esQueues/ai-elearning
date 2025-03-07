package kz.sayat.diploma_backend.quiz_module.mapper;


import kz.sayat.diploma_backend.quiz_module.dto.GradeDto;
import kz.sayat.diploma_backend.quiz_module.models.QuizAttempt;

public interface GradeMapper {
    QuizAttempt toGrade(GradeDto dto);
}
