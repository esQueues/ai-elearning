package kz.sayat.diploma_backend.quiz_module.service;

import kz.sayat.diploma_backend.quiz_module.dto.QuestionDto;

import java.util.List;

public interface QuestionService {
    QuestionDto createQuestion(QuestionDto dto, int quizId);
    List<QuestionDto> createQuestions(List<QuestionDto> dtos, int quizId);
    List<QuestionDto> getQuestionsByQuizId(int quizId);
    QuestionDto getQuestionById(int questionId);
    void deleteQuestion(int questionId);
}
