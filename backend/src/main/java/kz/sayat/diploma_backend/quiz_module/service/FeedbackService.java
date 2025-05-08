package kz.sayat.diploma_backend.quiz_module.service;

import kz.sayat.diploma_backend.quiz_module.dto.FeedbackDto;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface FeedbackService {

    String generateFeedback(int attemptId);

    String getFeedbackOfStudent(int attemptId, Authentication authentication);

    List<FeedbackDto> getAllFeedback();

    void deleteFeedback(int id);
}
