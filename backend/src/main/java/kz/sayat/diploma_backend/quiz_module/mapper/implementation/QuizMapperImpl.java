package kz.sayat.diploma_backend.quiz_module.mapper.implementation;

import kz.sayat.diploma_backend.course_module.dto.QuizSummaryDto;
import kz.sayat.diploma_backend.course_module.models.Module;
import kz.sayat.diploma_backend.quiz_module.dto.QuizDto;
import kz.sayat.diploma_backend.quiz_module.mapper.QuestionMapper;
import kz.sayat.diploma_backend.quiz_module.mapper.QuizMapper;
import kz.sayat.diploma_backend.quiz_module.models.Quiz;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class QuizMapperImpl implements QuizMapper {

    private final QuestionMapper  questionMapper;

    @Override
    public Quiz toQuiz(QuizDto dto, Module module) {
        if(dto == null) {
            return null;
        }
        Quiz quiz = new Quiz();
        quiz.setTitle(dto.getTitle());
        quiz.setModule(module);
        quiz.setQuestions(questionMapper.toQuestionList(dto.getQuestions(),quiz));
        return quiz;
    }

    @Override
    public QuizDto toQuizDto(Quiz quiz) {
        if(quiz == null) {
            return null;
        }
        QuizDto quizDto = new QuizDto();
        quizDto.setId(quiz.getId());
        quizDto.setTitle(quiz.getTitle());
        quizDto.setCourseId(quiz.getModule().getCourse().getId());
        quizDto.setModuleId(quiz.getModule().getId());
        quizDto.setQuestions(quiz.getQuestions() != null
            ? questionMapper.toDtoList(quiz.getQuestions())
            : List.of());

        return quizDto;
    }

    @Override
    public List<QuizDto> toQuizDtoList(List<Quiz> quizList) {
        return quizList.stream().
            map(this::toQuizDto).
            collect(Collectors.toList());
    }

    @Override
    public QuizSummaryDto toQuizSummaryDto(Quiz quiz) {
        if(quiz == null) {
            return null;
        }
        QuizSummaryDto quizSummaryDto = new QuizSummaryDto();
        quizSummaryDto.setId(quiz.getId());
        quizSummaryDto.setTitle(quiz.getTitle());
        quizSummaryDto.setModuleId(quiz.getModule().getId());
        return quizSummaryDto;
    }

    @Override
    public List<QuizSummaryDto> toQuizSummaryDtoList(List<Quiz> quizzes) {
        return quizzes.stream().
            map(this::toQuizSummaryDto).
            collect(Collectors.toList());
    }
}
