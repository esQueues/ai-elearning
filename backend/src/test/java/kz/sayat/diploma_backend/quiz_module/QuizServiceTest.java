package kz.sayat.diploma_backend.quiz_module;

import kz.sayat.diploma_backend.auth_module.models.Student;
import kz.sayat.diploma_backend.auth_module.service.StudentService;
import kz.sayat.diploma_backend.course_module.dto.QuizSummaryDto;
import kz.sayat.diploma_backend.course_module.models.Module;
import kz.sayat.diploma_backend.course_module.repository.ModuleRepository;
import kz.sayat.diploma_backend.quiz_module.dto.*;
import kz.sayat.diploma_backend.quiz_module.mapper.QuizAttemptMapper;
import kz.sayat.diploma_backend.quiz_module.mapper.QuizMapper;
import kz.sayat.diploma_backend.quiz_module.models.*;
import kz.sayat.diploma_backend.quiz_module.repository.AttemptAnswerRepository;
import kz.sayat.diploma_backend.quiz_module.repository.QuizAttemptRepository;
import kz.sayat.diploma_backend.quiz_module.repository.QuizRepository;
import kz.sayat.diploma_backend.quiz_module.service.QuizService;
import kz.sayat.diploma_backend.quiz_module.service.implementation.QuizServiceImpl;
import kz.sayat.diploma_backend.util.exceptions.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class QuizServiceTest {

    @Mock
    private QuizRepository quizRepository;
    @Mock
    private ModuleRepository moduleRepository;
    @Mock
    private QuizAttemptRepository quizAttemptRepository;
    @Mock
    private AttemptAnswerRepository attemptAnswerRepository;
    @Mock
    private QuizAttemptMapper quizAttemptMapper;
    @Mock
    private StudentService studentService;
    @Mock
    private QuizMapper quizMapper;

    @InjectMocks
    private QuizServiceImpl quizService;

    private QuizService service;
    private Quiz quiz;
    private QuizDto quizDto;
    private Module module;
    private Student student;
    private Authentication authentication;

    @BeforeEach
    void setUp() {
        service = quizService;

        module = new Module();
        module.setId(1);

        quiz = new Quiz();
        quiz.setId(1);
        quiz.setTitle("Test Quiz");
        quiz.setPassingScore(70);
        quiz.setQuestionCount(2);

        Question question1 = new Question();
        question1.setId(1);
        question1.setQuiz(quiz);
        Answer answer1 = new Answer();
        answer1.setId(1);
        answer1.setCorrect(true);
        answer1.setQuestion(question1);
        question1.setAnswers(new ArrayList<>(List.of(answer1))); // Ensure mutable list
        quiz.setQuestions(new ArrayList<>(List.of(question1)));

        quizDto = new QuizDto();
        quizDto.setId(1);
        quizDto.setTitle("Updated Quiz");
        quizDto.setPassingScore(80);
        QuestionDto questionDto = new QuestionDto();
        questionDto.setId(1);
        AnswerDto answerDto = new AnswerDto();
        answerDto.setId(1);
        answerDto.setCorrect(true);
        questionDto.setAnswers(new ArrayList<>(List.of(answerDto)));
        quizDto.setQuestions(new ArrayList<>(List.of(questionDto)));

        student = new Student();
        student.setId(1);

        authentication = mock(Authentication.class);
    }

    @Test
    void createQuiz_Success() {
        when(moduleRepository.findById(1)).thenReturn(Optional.of(module));
        when(quizMapper.toQuiz(any(QuizDto.class), any(Module.class))).thenReturn(quiz);
        when(quizRepository.save(any(Quiz.class))).thenReturn(quiz);
        when(quizMapper.toQuizDto(any(Quiz.class))).thenReturn(quizDto);

        QuizDto result = service.createQuiz(quizDto, 1);

        assertNotNull(result);
        assertEquals(quizDto.getTitle(), result.getTitle());
        verify(quizRepository).save(any(Quiz.class));
    }

    @Test
    void createQuiz_ModuleNotFound_ThrowsException() {
        when(moduleRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.createQuiz(quizDto, 1));
    }

    @Test
    void findQuiz_Success() {
        when(quizRepository.findById(1)).thenReturn(Optional.of(quiz));
        when(quizMapper.toQuizDto(any(Quiz.class))).thenReturn(quizDto);

        QuizDto result = service.findQuiz(1);

        assertNotNull(result);
        assertEquals(quizDto.getTitle(), result.getTitle());
        verify(quizRepository).findById(1);
    }

    @Test
    void findQuiz_NotFound_ThrowsException() {
        when(quizRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.findQuiz(1));
    }

    @Test
    void findAllQuizByModuleId_Success() {
        List<Quiz> quizzes = new ArrayList<>(List.of(quiz));
        List<QuizSummaryDto> summaryDtos = List.of(new QuizSummaryDto());
        when(quizRepository.findQuizzesByModule_Id(1)).thenReturn(quizzes);
        when(quizMapper.toQuizSummaryDtoList(quizzes)).thenReturn(summaryDtos);

        List<QuizSummaryDto> result = service.findAllQuizByModuleId(1);

        assertNotNull(result);
        assertEquals(summaryDtos.size(), result.size());
        verify(quizRepository).findQuizzesByModule_Id(1);
    }

    @Test
    void assignGrade_Success() {
        StudentAnswerDto studentAnswerDto = new StudentAnswerDto();
        studentAnswerDto.setQuestionId(1);
        studentAnswerDto.setAnswerId(1);
        List<StudentAnswerDto> studentAnswers = new ArrayList<>(List.of(studentAnswerDto));

        QuizAttempt quizAttempt = new QuizAttempt();
        quizAttempt.setId(1);
        quizAttempt.setScore(100.0);
        quizAttempt.setPassed(true);

        when(studentService.getStudentFromUser(authentication)).thenReturn(student);
        when(quizRepository.findById(1)).thenReturn(Optional.of(quiz));
        when(quizAttemptRepository.findByStudentAndQuiz(student, quiz)).thenReturn(new ArrayList<>());
        when(quizAttemptRepository.save(any(QuizAttempt.class))).thenReturn(quizAttempt);
        when(quizAttemptMapper.toQuizAttemptDto(any(QuizAttempt.class))).thenReturn(new QuizAttemptDto());

        QuizAttemptDto result = service.assignGrade(studentAnswers, authentication, 1, 300);

        assertNotNull(result);
        verify(quizAttemptRepository).save(any(QuizAttempt.class));
        verify(attemptAnswerRepository).save(any(QuizAttemptAnswer.class));
    }

    @Test
    void assignGrade_QuizNotFound_ThrowsException() {
        when(quizRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () ->
                service.assignGrade(new ArrayList<>(), authentication, 1, 300));
    }

    @Test
    void delete_Success() {
        when(quizRepository.findById(1)).thenReturn(Optional.of(quiz));

        service.delete(1);

        verify(quizRepository).delete(quiz);
    }

    @Test
    void delete_QuizNotFound_ThrowsException() {
        when(quizRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.delete(1));
    }

    @Test
    void getAttempt_Success() {
        QuizAttempt quizAttempt = new QuizAttempt();
        when(studentService.getStudentFromUser(authentication)).thenReturn(student);
        when(quizRepository.findById(1)).thenReturn(Optional.of(quiz));
        when(quizAttemptRepository.findTopByStudentAndQuizOrderByAttemptNumberDesc(student, quiz))
                .thenReturn(quizAttempt);
        when(quizAttemptMapper.toQuizAttemptDto(quizAttempt)).thenReturn(new QuizAttemptDto());

        QuizAttemptDto result = service.getAttempt(1, authentication);

        assertNotNull(result);
        verify(quizAttemptRepository).findTopByStudentAndQuizOrderByAttemptNumberDesc(student, quiz);
    }

    @Test
    void getAttempt_QuizNotFound_ThrowsException() {
        when(studentService.getStudentFromUser(authentication)).thenReturn(student);
        when(quizRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.getAttempt(1, authentication));
    }

    @Test
    void update_Success() {
        when(quizRepository.findById(1)).thenReturn(Optional.of(quiz));
        when(quizRepository.save(any(Quiz.class))).thenReturn(quiz);

        service.update(1, quizDto);

        verify(quizRepository).save(any(Quiz.class));
        assertEquals(quizDto.getTitle(), quiz.getTitle());
        assertEquals(quizDto.getPassingScore(), quiz.getPassingScore());
    }

    @Test
    void update_QuizNotFound_ThrowsException() {
        when(quizRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.update(1, quizDto));
    }
}