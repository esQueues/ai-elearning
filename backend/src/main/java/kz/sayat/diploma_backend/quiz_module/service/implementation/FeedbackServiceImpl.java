package kz.sayat.diploma_backend.quiz_module.service.implementation;

import jakarta.transaction.Transactional;
import kz.sayat.diploma_backend.auth_module.models.Student;
import kz.sayat.diploma_backend.auth_module.service.StudentService;
import kz.sayat.diploma_backend.quiz_module.dto.FeedbackDto;
import kz.sayat.diploma_backend.quiz_module.service.FeedbackService;
import kz.sayat.diploma_backend.util.exceptions.ResourceNotFoundException;
import kz.sayat.diploma_backend.quiz_module.dto.GeminiRequest;
import kz.sayat.diploma_backend.quiz_module.dto.GeminiResponse;
import kz.sayat.diploma_backend.quiz_module.models.*;
import kz.sayat.diploma_backend.quiz_module.repository.FeedbackRepository;
import kz.sayat.diploma_backend.quiz_module.repository.QuizAttemptRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class FeedbackServiceImpl implements FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final StudentService studentService;

    @Value("${gemini.api-key}")
    private String apiKey;

    @Value("${gemini.api-url}")
    private String apiUrl;


    @Override
    public String generateFeedback(int attemptId) {
        QuizAttempt quizAttempt = quizAttemptRepository.findById(attemptId)
            .orElseThrow(() -> new ResourceNotFoundException("quiz attempt not found"));

        String promptText = buildPrompt(quizAttempt);
        String feedbackText = getFeedback(promptText);

        feedbackRepository.save(new Feedback(promptText, feedbackText, quizAttempt));
        return feedbackText;
    }

    @Override
    public String getFeedbackOfStudent(int attemptId, Authentication authentication) {
        Student student = studentService.getStudentFromUser(authentication);

        QuizAttempt attempt = quizAttemptRepository.findById(attemptId)
            .orElseThrow(() -> new ResourceNotFoundException("Quiz attempt not found"));


        if (attempt.getStudent().getId() != student.getId()) {
            throw new ResourceNotFoundException("You are not allowed to view this feedback");
        }

        Feedback feedback = feedbackRepository.findByQuizAttempt(attempt)
            .orElseThrow(() -> new ResourceNotFoundException("Feedback not found for this attempt"));

        return feedback.getFeedbackText();
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public List<FeedbackDto> getAllFeedback() {
        List<Feedback> feedbacks = feedbackRepository.findAll();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        return feedbacks.stream()
            .map(feedback -> {
                String studentFirstname = feedback.getQuizAttempt().getStudent().getFirstname();
                String studentLastname = feedback.getQuizAttempt().getStudent().getLastname();
                String courseTitle = feedback.getQuizAttempt().getQuiz().getModule().getCourse().getTitle();
                String quizTitle = feedback.getQuizAttempt().getQuiz().getTitle();
                String attemptTime = feedback.getCreatedAt().format(formatter);


                return new FeedbackDto(
                    feedback.getId(),
                    feedback.getFeedbackText(),
                    studentFirstname,
                    studentLastname,
                    courseTitle,
                    quizTitle,
                    attemptTime
                );
            })
            .collect(Collectors.toList());
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteFeedback(int id) {
        feedbackRepository.deleteById(id);
    }

    private String buildPrompt(QuizAttempt quizAttempt) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Quiz Attempt Summary:\n");
        prompt.append("Student: ").append(quizAttempt.getStudent().getFirstname()).append("\n");
        prompt.append("Quiz Topic: ").append(quizAttempt.getQuiz().getTitle()).append("\n");
        prompt.append("Attempt Number: ").append(quizAttempt.getAttemptNumber()).append("\n");
        prompt.append("Score: ").append(quizAttempt.getScore()).append("/100\n\n");

        prompt.append("Answers:\n");

        for (QuizAttemptAnswer attemptAnswer : quizAttempt.getAttemptAnswers()) {
            Question question = attemptAnswer.getQuestion();

            String correctAnswerText = question.getAnswers().stream()
                    .filter(Answer::isCorrect)
                    .map(Answer::getAnswerText)
                    .findFirst()
                    .orElse("Correct answer not found");

            prompt.append("- Question: ").append(question.getQuestionText()).append("\n");
            prompt.append("  Student's Answer: ").append(attemptAnswer.getAnswer().getAnswerText()).append("\n");
            prompt.append("  Correct Answer: ").append(correctAnswerText).append("\n");
            prompt.append("  Result: ").append(attemptAnswer.isCorrect() ? "✅ Correct" : "❌ Incorrect").append("\n\n");

            prompt.append("  🧐 Explanation:\n");

            if (!attemptAnswer.isCorrect()) {
                prompt.append("  ❌ The student answered this question incorrectly. Analyze the mistake and provide a detailed explanation. Why is this answer incorrect? What kind of misunderstanding or faulty logic might have led to it?\n\n");
                prompt.append("  ✅ Explain the correct answer. Why is it correct? What facts, logic, or theoretical concepts support it?\n\n");
            } else {
                prompt.append("  ✅ The student answered correctly. Still, provide additional useful information. What other important facts are related to this question? For example, historical context, formulas, rules, or practical examples.\n\n");
            }
        }

        prompt.append("📌 Finally, highlight which topics the student should review. What knowledge gaps are evident?\n");
        prompt.append("📌 Make the explanation clear and informative. Avoid short or vague answers.\n");

        return prompt.toString();
    }




    private String getFeedback(String quizResult) {
        RestTemplate restTemplate = new RestTemplate();
        String API_URL = apiUrl + apiKey;

        GeminiRequest request = new GeminiRequest(quizResult);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<GeminiRequest> entity = new HttpEntity<>(request, headers);
        ResponseEntity<GeminiResponse> response = restTemplate.exchange(API_URL, HttpMethod.POST, entity, GeminiResponse.class);

        if (response.getBody() != null && response.getBody().getCandidates() != null) {
            List<GeminiResponse.Candidate> candidates = response.getBody().getCandidates();

            if (!candidates.isEmpty() && candidates.get(0).getContent() != null) {
                List<GeminiResponse.Part> parts = candidates.get(0).getContent().getParts();
                if (!parts.isEmpty()) {
                    return parts.get(0).getText();
                }
            }
        }

        return "No feedback available.";
    }
}
