package kz.sayat.diploma_backend.quiz_module.service;

import kz.sayat.diploma_backend.course_module.dto.QuizSummaryDto;
import kz.sayat.diploma_backend.quiz_module.dto.QuizAttemptDto;
import kz.sayat.diploma_backend.quiz_module.dto.QuizDto;
import kz.sayat.diploma_backend.quiz_module.dto.StudentAnswerDto;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface QuizService {

    QuizDto createQuiz(QuizDto dto, int moduleId);

    QuizDto findQuiz(int quizId);

    List<QuizSummaryDto> findAllQuizByModuleId(int moduleId);

    QuizAttemptDto assignGrade(List<StudentAnswerDto> studentAnswers, Authentication authentication, int quizId);

    void delete(int quizId);

    QuizAttemptDto getAttempt(int quizId, Authentication authentication);

    void update(int quizId, QuizDto dto);
}
