package kz.sayat.diploma_backend.quiz_module.mapper;

import kz.sayat.diploma_backend.course_module.dto.QuizSummaryDto;
import kz.sayat.diploma_backend.course_module.models.Module;
import kz.sayat.diploma_backend.quiz_module.dto.QuizDto;
import kz.sayat.diploma_backend.quiz_module.models.Quiz;

import java.util.List;

public interface QuizMapper {
    Quiz toQuiz(QuizDto dto, Module module);
    QuizDto toQuizDto(Quiz quiz);
    List<QuizDto> toQuizDtoList(List<Quiz> quizList);
    QuizSummaryDto toQuizSummaryDto(Quiz quiz);

    List<QuizSummaryDto> toQuizSummaryDtoList(List<Quiz> quizzes);
}
