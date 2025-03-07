package kz.sayat.diploma_backend.quiz_module.mapper.implementation;

import kz.sayat.diploma_backend.quiz_module.dto.AnswerDto;
import kz.sayat.diploma_backend.quiz_module.mapper.AnswerMapper;
import kz.sayat.diploma_backend.quiz_module.models.Answer;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class AnswerMapperImpl implements AnswerMapper {
    @Override
    public Answer toAnswer(AnswerDto dto) {
        if (dto == null) {
            return null;
        }
        Answer answer = new Answer();
        answer.setAnswerText(dto.getAnswerText());
        answer.setCorrect(dto.isCorrect());
        return answer;
    }

    @Override
    public AnswerDto toAnswerDto(Answer answer) {
        if (answer == null) {
            return null;
        }
        AnswerDto dto = new AnswerDto();
        dto.setId(answer.getId());
        dto.setAnswerText(answer.getAnswerText());
        dto.setCorrect(answer.isCorrect());
        return dto;
    }

    @Override
    public List<Answer> toAnswerList(List<AnswerDto> dtoList) {
        return dtoList.stream()
            .map(this::toAnswer)
            .collect(Collectors.toList());
    }

    @Override
    public List<AnswerDto> toAnswerDtoList(List<Answer> answers) {
        return answers.stream()
            .map(this::toAnswerDto)
            .collect(Collectors.toList());
    }
}
