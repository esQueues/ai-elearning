package kz.sayat.diploma_backend.quiz_module.mapper;

import kz.sayat.diploma_backend.quiz_module.dto.AnswerDto;
import kz.sayat.diploma_backend.quiz_module.models.Answer;

import java.util.List;

public interface AnswerMapper {
    Answer toAnswer(AnswerDto dto);
    AnswerDto toAnswerDto(Answer answer);
    List<Answer> toAnswerList(List<AnswerDto> dtoList);

    List<AnswerDto> toAnswerDtoList(List<Answer> answers);
}
