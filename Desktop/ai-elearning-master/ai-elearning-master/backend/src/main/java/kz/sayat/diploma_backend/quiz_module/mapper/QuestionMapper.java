package kz.sayat.diploma_backend.quiz_module.mapper;

import kz.sayat.diploma_backend.quiz_module.dto.QuestionDto;
import kz.sayat.diploma_backend.quiz_module.models.Question;
import kz.sayat.diploma_backend.quiz_module.models.Quiz;
import org.springframework.stereotype.Repository;

import java.util.List;


public interface QuestionMapper {
    QuestionDto toDto(Question question);

    List<QuestionDto> toDtoList(List<Question> questions);

    Question toQuestion(QuestionDto questionDto, Quiz quiz);

    List<Question> toQuestionList(List<QuestionDto> questionDtos, Quiz quiz);
}
