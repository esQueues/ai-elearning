package kz.sayat.diploma_backend.quiz_module.mapper;

import kz.sayat.diploma_backend.quiz_module.dto.QuizAttemptDto;
import kz.sayat.diploma_backend.quiz_module.models.QuizAttempt;

public interface QuizAttemptMapper {
    QuizAttemptDto toQuizAttemptDto(QuizAttempt quizAttempt);
}
