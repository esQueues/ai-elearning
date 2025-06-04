package kz.sayat.diploma_backend.quiz_module.service.implementation;

import jakarta.transaction.Transactional;
import kz.sayat.diploma_backend.auth_module.models.Student;
import kz.sayat.diploma_backend.auth_module.service.StudentService;
import kz.sayat.diploma_backend.course_module.models.Lecture; // Import Lecture entity
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
                .orElseThrow(() -> new ResourceNotFoundException("Quiz attempt not found"));

        int passingScore = quizAttempt.getQuiz().getPassingScore();
        boolean isPassed = quizAttempt.getScore() >= passingScore;

        List<Lecture> lectures = quizAttempt.getQuiz().getModule().getLectures();
        if (lectures == null || lectures.isEmpty()) {
            throw new ResourceNotFoundException("No lecture found for this module");
        }
        if (lectures.size() > 1) {
            throw new IllegalStateException("Expected exactly one lecture, but found " + lectures.size());
        }
        String youtubeLink = lectures.get(0).getUrl();
        if (youtubeLink == null || youtubeLink.isEmpty()) {
            throw new ResourceNotFoundException("YouTube link not found for the lecture");
        }

        String promptText = buildPrompt(quizAttempt, isPassed, youtubeLink);
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

    private String buildPrompt(QuizAttempt quizAttempt, boolean isPassed, String youtubeLink) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Quiz Attempt Summary:\n");
        prompt.append("Student: ").append(quizAttempt.getStudent().getFirstname()).append("\n");
        prompt.append("Quiz Topic: ").append(quizAttempt.getQuiz().getTitle()).append("\n");
        prompt.append("Attempt Number: ").append(quizAttempt.getAttemptNumber()).append("\n");
        prompt.append("Score: ").append(quizAttempt.getScore()).append("/100\n");
        prompt.append("Maximum Allowed Time: ").append(formatDuration(quizAttempt.getQuiz().getDurationInMinutes() * 60)).append("\n");
        prompt.append("Time Taken: ").append(formatDuration(quizAttempt.getDurationSeconds())).append("\n\n");

        prompt.append("Lecture YouTube Link: ").append(youtubeLink).append("\n\n");
        prompt.append("Instructions: Analyze the YouTube lecture video to identify timecodes where topics related to the quiz questions are discussed. For incorrect answers, suggest specific timecodes where the student should revisit to understand the correct concepts.\n\n");

        prompt.append("⏳ Time Analysis:\n");
        prompt.append("Compare the time taken (").append(formatDuration(quizAttempt.getDurationSeconds())).append(") ");
        prompt.append("with the maximum allowed time (").append(formatDuration(quizAttempt.getQuiz().getDurationInMinutes() * 60)).append("). ");
        prompt.append("Provide feedback on the student's time management. Did they rush? Were they too slow? Could pacing affect accuracy?\n\n");

        prompt.append("Answers:\n");

        for (QuizAttemptAnswer attemptAnswer : quizAttempt.getAttemptAnswers()) {
            Question question = attemptAnswer.getQuestion();
            String studentAnswer = attemptAnswer.getAnswer().getAnswerText();

            prompt.append("- Question: ").append(question.getQuestionText()).append("\n");
            prompt.append("  Student's Answer: ").append(studentAnswer).append("\n");

            if (isPassed) {
                String correctAnswerText = question.getAnswers().stream()
                        .filter(Answer::isCorrect)
                        .map(Answer::getAnswerText)
                        .findFirst()
                        .orElse("Correct answer not found");
                prompt.append("  Correct Answer: ").append(correctAnswerText).append("\n");
            } else {
                prompt.append("  Correct Answer: 🔒 Hidden (will be available after passing the quiz)\n");
            }

            prompt.append("  Result: ").append(attemptAnswer.isCorrect() ? "✅ Correct" : "❌ Incorrect").append("\n\n");
            prompt.append("  🧐 Explanation:\n");

            if (!attemptAnswer.isCorrect()) {
                if (isPassed) {
                    prompt.append("  ❌ The student answered this question incorrectly. Analyze the mistake and explain why the chosen answer is wrong.\n");
                    prompt.append("  ✅ Explain the correct answer. What facts or logic support it?\n");
                    prompt.append("  📽️ Suggest a specific timecode in the YouTube lecture (").append(youtubeLink).append(") where the relevant topic is discussed to help the student review.\n\n");
                } else {
                    prompt.append("  ❌ The student answered incorrectly. Suggest what concepts they might have misunderstood and what topics they should revisit. Do not mention the correct answer directly.\n");
                    prompt.append("  📽️ Suggest a specific timecode in the YouTube lecture (").append(youtubeLink).append(") where the relevant topic is discussed to help the student review.\n\n");
                }
            } else {
                prompt.append("  ✅ The student answered correctly. Provide additional insight or context to deepen understanding.\n");
                prompt.append("  📽️ Suggest a specific timecode in the YouTube lecture (").append(youtubeLink).append(") for further exploration of this topic.\n\n");
            }
        }

        prompt.append("📌 Advice:\n");
        prompt.append("Based on the overall performance, highlight which topics the student should review. Do not reveal answers directly unless the quiz was passed.\n");
        prompt.append("📌 Identify knowledge gaps based on patterns in incorrect answers and recommend specific subject areas or concepts.\n");
        prompt.append("📌 For each recommended topic, suggest a specific timecode in the YouTube lecture (").append(youtubeLink).append(") where the topic is covered.\n");
        prompt.append("📌 Make the explanation clear, informative, and concise. Avoid vague answers.\n");

        return prompt.toString();
    }

    private String formatDuration(int seconds) {
        int minutes = seconds / 60;
        int remainingSeconds = seconds % 60;
        return String.format("%d:%02d", minutes, remainingSeconds);
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