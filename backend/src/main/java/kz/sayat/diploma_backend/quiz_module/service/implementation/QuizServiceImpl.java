package kz.sayat.diploma_backend.quiz_module.service.implementation;

import jakarta.transaction.Transactional;
import kz.sayat.diploma_backend.auth_module.models.Student;
import kz.sayat.diploma_backend.auth_module.service.StudentService;
import kz.sayat.diploma_backend.course_module.models.Course;
import kz.sayat.diploma_backend.quiz_module.dto.*;
import kz.sayat.diploma_backend.quiz_module.mapper.QuestionMapper;
import kz.sayat.diploma_backend.quiz_module.service.QuizService;
import kz.sayat.diploma_backend.util.exceptions.ResourceNotFoundException;
import kz.sayat.diploma_backend.course_module.dto.QuizSummaryDto;
import kz.sayat.diploma_backend.quiz_module.mapper.QuizAttemptMapper;
import kz.sayat.diploma_backend.quiz_module.mapper.QuizMapper;
import kz.sayat.diploma_backend.course_module.models.Module;
import kz.sayat.diploma_backend.quiz_module.models.*;
import kz.sayat.diploma_backend.course_module.repository.ModuleRepository;
import kz.sayat.diploma_backend.quiz_module.repository.AttemptAnswerRepository;
import kz.sayat.diploma_backend.quiz_module.repository.QuizAttemptRepository;
import kz.sayat.diploma_backend.quiz_module.repository.QuizRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class QuizServiceImpl implements QuizService {

    private final QuizRepository quizRepository;
    private final ModuleRepository moduleRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final AttemptAnswerRepository attemptAnswerRepository;
    private final QuizAttemptMapper quizAttemptMapper;
    private final QuestionMapper questionMapper;
    private final StudentService studentService;
    private final QuizMapper quizMapper;



    @Override
    public QuizDto createQuiz(QuizDto dto, int moduleId) {

        Module module = moduleRepository.findById(moduleId).
            orElseThrow(() -> new ResourceNotFoundException("module not found"));
        Quiz quiz = quizMapper.toQuiz(dto, module);

        for (Question question : quiz.getQuestions()) {
            question.setQuiz(quiz);
        }
        quizRepository.save(quiz);

        return quizMapper.toQuizDto(quiz);
    }

    @Override
    public QuizDto findQuiz(int quizId) {
        Quiz quiz = quizRepository.findById(quizId).
            orElseThrow(() -> new ResourceNotFoundException("quiz not found"));

        return quizMapper.toQuizDto(quiz);
    }

    public List<QuizSummaryDto> findAllQuizByModuleId(int moduleId) {
        List<Quiz >quizzes=quizRepository.findQuizzesByModule_Id(moduleId);
        return quizMapper.toQuizSummaryDtoList(quizzes);
    }

    @Override
    public QuizAttemptDto assignGrade(List<StudentAnswerDto> studentAnswers, Authentication authentication, int quizId) {
        Student student= studentService.getStudentFromUser(authentication);

        Quiz quiz = quizRepository.findById(quizId).
            orElseThrow(() -> new ResourceNotFoundException("quiz not found"));

        QuizAttempt quizAttempt = new QuizAttempt();
        quizAttempt.setStudent(student);
        quizAttempt.setQuiz(quiz);
        quizAttempt.setAttemptNumber(getNextAttemptNumber(student, quiz));

        List<QuizAttemptAnswer> attemptAnswers = mapStudentAnswersToAttempt(studentAnswers, quiz);

        double score = calculateScore(attemptAnswers, quiz);
        quizAttempt.setScore(score);

        boolean passed = score >= quiz.getPassingScore();
        quizAttempt.setPassed(passed);

        quizAttemptRepository.save(quizAttempt);

        for (QuizAttemptAnswer attemptAnswer : attemptAnswers) {
            attemptAnswer.setQuizAttempt(quizAttempt);
            attemptAnswerRepository.save(attemptAnswer);
        }

        return quizAttemptMapper.toQuizAttemptDto(quizAttempt);
    }

    @Override
    public void delete(int quizId) {
        Quiz quiz = quizRepository.findById(quizId)
            .orElseThrow(() -> new ResourceNotFoundException("quiz not found"));
        quizRepository.delete(quiz);
    }

    @Override
    public QuizAttemptDto getAttempt(int quizId, Authentication authentication) {
        Student student = studentService.getStudentFromUser(authentication);
        Quiz quiz= quizRepository.findById(quizId)
                .orElseThrow(()-> new ResourceNotFoundException("quiz not found"));
        QuizAttempt attempt = quizAttemptRepository
            .findTopByStudentAndQuizOrderByAttemptNumberDesc(student, quiz);
        return quizAttemptMapper.toQuizAttemptDto(attempt);
    }

    @Override
    public void update(int quizId, QuizDto dto) {
        Quiz quiz = quizRepository.findById(quizId)
            .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));

        quiz.setTitle(dto.getTitle());

        Map<Integer, Question> existingQuestions = quiz.getQuestions().stream()
            .collect(Collectors.toMap(Question::getId, q -> q));

        for (QuestionDto qDto : dto.getQuestions()) {
            Question question = existingQuestions.getOrDefault(qDto.getId(), new Question());
            question.setQuestionText(qDto.getQuestionText());
            question.setQuiz(quiz);

            // ⚠️ Instead of replacing, update existing answers
            Map<Integer, Answer> existingAnswers = question.getAnswers().stream()
                .collect(Collectors.toMap(Answer::getId, a -> a));

            // Create a list to hold updated answers
            List<Answer> answersToKeep = new ArrayList<>();

            for (AnswerDto aDto : qDto.getAnswers()) {
                Answer answer = existingAnswers.getOrDefault(aDto.getId(), new Answer());
                answer.setAnswerText(aDto.getAnswerText());
                answer.setCorrect(aDto.isCorrect());
                answer.setQuestion(question);
                answersToKeep.add(answer);
            }

            // ⚠️ Instead of `setAnswers()`, modify the list directly
            question.getAnswers().clear();
            question.getAnswers().addAll(answersToKeep);
        }

        quizRepository.save(quiz);
    }






    private int getNextAttemptNumber(Student student, Quiz quiz) {
        List<QuizAttempt> attempts = quizAttemptRepository.findByStudentAndQuiz(student, quiz);
        return attempts.size() + 1;
    }

    private double calculateScore(List<QuizAttemptAnswer> attemptAnswers, Quiz quiz) {
        Map<Integer, Boolean> correctAnswersMap = quiz.getQuestions().stream()
            .flatMap(q -> q.getAnswers().stream())
            .collect(Collectors.toMap(Answer::getId, Answer::isCorrect));

        long totalQuestions = quiz.getQuestions().size();
        long correctAnswers = attemptAnswers.stream()
            .filter(attemptAnswer -> correctAnswersMap.get(attemptAnswer.getAnswer().getId()))
            .count();

        return (double) correctAnswers / totalQuestions * 100;
    }

    private List<QuizAttemptAnswer> mapStudentAnswersToAttempt(List<StudentAnswerDto> studentAnswers, Quiz quiz) {
        return studentAnswers.stream()
            .map(studentAnswer -> {
                Question question = quiz.getQuestions().stream()
                    .filter(q -> q.getId() == studentAnswer.getQuestionId())
                    .findFirst()
                    .orElseThrow(() -> new ResourceNotFoundException("Question not found"));

                Answer answer = question.getAnswers().stream()
                    .filter(a -> a.getId() == studentAnswer.getAnswerId())
                    .findFirst()
                    .orElseThrow(() -> new ResourceNotFoundException("Answer not found"));

                return createAttemptAnswer(question, answer);
            })
            .collect(Collectors.toList());
    }
    private QuizAttemptAnswer createAttemptAnswer(Question question, Answer answer) {
        QuizAttemptAnswer attemptAnswer = new QuizAttemptAnswer();
        attemptAnswer.setQuestion(question);
        attemptAnswer.setAnswer(answer);
        attemptAnswer.setCorrect(answer.isCorrect());
        return attemptAnswer;
    }


}
