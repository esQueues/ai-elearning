package kz.sayat.diploma_backend.quiz_module.mapper.implementation;

import kz.sayat.diploma_backend.quiz_module.dto.QuizAttemptDto;
import kz.sayat.diploma_backend.quiz_module.mapper.QuizAttemptMapper;
import kz.sayat.diploma_backend.quiz_module.models.QuizAttempt;
import org.springframework.stereotype.Component;

@Component
public class QuizAttemptMapperImpl implements QuizAttemptMapper {
    @Override
    public QuizAttemptDto toQuizAttemptDto(QuizAttempt quizAttempt) {
        if(quizAttempt == null){
            return null;
        }
        return new QuizAttemptDto(
            quizAttempt.getId(),
            quizAttempt.getStudent().getId(),
            quizAttempt.getQuiz().getId(),
            quizAttempt.getAttemptNumber(),
            quizAttempt.getScore(),
            quizAttempt.isPassed()
        );
    }
}
