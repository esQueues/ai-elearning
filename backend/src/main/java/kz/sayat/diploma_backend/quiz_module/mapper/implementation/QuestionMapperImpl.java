package kz.sayat.diploma_backend.quiz_module.mapper.implementation;

import kz.sayat.diploma_backend.quiz_module.dto.QuestionDto;
import kz.sayat.diploma_backend.quiz_module.mapper.AnswerMapper;
import kz.sayat.diploma_backend.quiz_module.mapper.QuestionMapper;
import kz.sayat.diploma_backend.quiz_module.models.Answer;
import kz.sayat.diploma_backend.quiz_module.models.Question;
import kz.sayat.diploma_backend.quiz_module.models.Quiz;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class QuestionMapperImpl implements QuestionMapper {

    private final AnswerMapper answerMapper;

    @Override
    public QuestionDto toDto(Question question) {
        if (question == null) {
            return null;
        }
        QuestionDto dto = new QuestionDto();
        dto.setId(question.getId());
        dto.setQuestionText(question.getQuestionText());
        dto.setQuizId(question.getQuiz().getId());
        dto.setAnswers(answerMapper.toAnswerDtoList(question.getAnswers()));
        return dto;
    }

    @Override
    public List<QuestionDto> toDtoList(List<Question> questions) {
        return questions.stream()
            .map(this:: toDto)
            .collect(Collectors.toList());
    }

    @Override
    public Question toQuestion(QuestionDto questionDto, Quiz quiz) {
        if(questionDto == null) {
            return null;
        }
        Question question = new Question();
        question.setQuestionText(questionDto.getQuestionText());
        question.setQuiz(quiz);

        List<Answer> answers = answerMapper.toAnswerList(questionDto.getAnswers());
        answers.forEach(answer -> answer.setQuestion(question));
        question.setAnswers(answers);

        return question;

    }

    @Override
    public List<Question> toQuestionList(List<QuestionDto> dtos, Quiz quiz) {
        return dtos.stream().map(dto -> toQuestion(dto, quiz)).collect(Collectors.toList());
    }


}
