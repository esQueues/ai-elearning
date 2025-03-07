package kz.sayat.diploma_backend.quiz_module.controller;


import kz.sayat.diploma_backend.quiz_module.dto.FeedbackDto;
import kz.sayat.diploma_backend.quiz_module.models.Feedback;
import kz.sayat.diploma_backend.quiz_module.service.FeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/quiz/feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;

    @PostMapping("/{attemptId}")
    public ResponseEntity<String> getQuizFeedback(@PathVariable(name = "attemptId") int attemptId ) {
        return ResponseEntity.status(201).body(feedbackService.generateFeedback(attemptId));
    }

    @GetMapping("/{attemptId}")
    public ResponseEntity<String> getFeedback(@PathVariable(name = "attemptId") int attemptId,
                                              Authentication authentication){
        return ResponseEntity.ok(feedbackService.getFeedbackOfStudent(attemptId,authentication));
    }

    @GetMapping("/all")
    public ResponseEntity<List<FeedbackDto>> getAllFeedback(){
        return ResponseEntity.ok(feedbackService.getAllFeedback());
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable(name = "id") int id) {
        feedbackService.deleteFeedback(id);
    }

}
