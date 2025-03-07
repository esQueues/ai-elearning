package kz.sayat.diploma_backend.quiz_module.controller;

import kz.sayat.diploma_backend.quiz_module.dto.QuestionDto;
import kz.sayat.diploma_backend.quiz_module.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quiz")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @PostMapping("/{quizId}/question")
    public ResponseEntity<QuestionDto> createQuestion(@RequestBody QuestionDto dto,
                                                      @PathVariable(name = "quizId") int quizId) {
        return ResponseEntity.ok(questionService.createQuestion(dto,quizId));
    }

    @PostMapping("/{quizId}/questions")
    public ResponseEntity<List<QuestionDto>> createQuestions(@RequestBody List<QuestionDto> dtos,
                                                             @PathVariable(name = "quizId") int quizId) {
        return ResponseEntity.ok(questionService.createQuestions(dtos, quizId));
    }


    @GetMapping("/question/{questionId}")
    public ResponseEntity<QuestionDto> getQuestionById(@PathVariable int questionId) {
        return ResponseEntity.ok(questionService.getQuestionById(questionId));
    }

    @GetMapping("/{quizId}/questions")
    public ResponseEntity<List<QuestionDto>> getQuestionsByQuiz(@PathVariable int quizId) {
        return ResponseEntity.ok(questionService.getQuestionsByQuizId(quizId));
    }

    @DeleteMapping("/question/{questionId}")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void deleteQuestion(@PathVariable int questionId) {
        questionService.deleteQuestion(questionId);
    }

}
