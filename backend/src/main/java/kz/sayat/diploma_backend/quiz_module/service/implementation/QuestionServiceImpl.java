package kz.sayat.diploma_backend.quiz_module.service.implementation;

import kz.sayat.diploma_backend.quiz_module.service.QuestionService;
import kz.sayat.diploma_backend.util.exceptions.ResourceNotFoundException;
import kz.sayat.diploma_backend.quiz_module.dto.QuestionDto;
import kz.sayat.diploma_backend.quiz_module.mapper.QuestionMapper;
import kz.sayat.diploma_backend.quiz_module.models.Question;
import kz.sayat.diploma_backend.quiz_module.models.Quiz;
import kz.sayat.diploma_backend.quiz_module.repository.QuestionRepository;
import kz.sayat.diploma_backend.quiz_module.repository.QuizRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class QuestionServiceImpl implements QuestionService {

    private final QuestionRepository questionRepository;
    private final QuizRepository quizRepository;
    private final QuestionMapper questionMapper;

    public QuestionDto createQuestion(QuestionDto dto, int quizId) {

        Quiz quiz = quizRepository.findById(quizId)
            .orElseThrow(() -> new ResourceNotFoundException("quiz not found"));


        Question question = questionMapper.toQuestion(dto, quiz);
        questionRepository.save(question);

        return questionMapper.toDto(question);
    }

    public List<QuestionDto> createQuestions(List<QuestionDto> dtos, int quizId) {

        Quiz quiz = quizRepository.findById(quizId)
            .orElseThrow(() -> new ResourceNotFoundException("quiz not found"));

        List<Question> questions = questionMapper.toQuestionList(dtos, quiz);
        questionRepository.saveAll(questions);

        return questionMapper.toDtoList(questions);

    }

    public QuestionDto getQuestionById(int questionId) {
        Question question = questionRepository.findById(questionId)
            .orElseThrow(() -> new ResourceNotFoundException("quiz not found"));

        return questionMapper.toDto(question);
    }


    public List<QuestionDto> getQuestionsByQuizId(int quizId) {
        Quiz quiz = quizRepository.findById(quizId)
            .orElseThrow(() -> new ResourceNotFoundException("quiz not found"));

        List<Question> questions=questionRepository.findByQuiz(quiz);
        return questionMapper.toDtoList(questions);
    }


    public void deleteQuestion(int questionId) {
        if (!questionRepository.existsById(questionId)) {
            throw new ResourceNotFoundException("quiz not found");
        }
        questionRepository.deleteById(questionId);
    }
}
