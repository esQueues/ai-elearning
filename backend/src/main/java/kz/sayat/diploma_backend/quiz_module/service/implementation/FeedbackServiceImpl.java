package kz.sayat.diploma_backend.quiz_module.service.implementation;

import jakarta.transaction.Transactional;
import kz.sayat.diploma_backend.auth_module.models.Student;
import kz.sayat.diploma_backend.auth_module.service.StudentService;
import kz.sayat.diploma_backend.quiz_module.dto.FeedbackDto;
import kz.sayat.diploma_backend.quiz_module.repository.AttemptAnswerRepository;
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
    public void deleteFeedback(int id) {
        feedbackRepository.deleteById(id);
    }

    private String buildPrompt(QuizAttempt quizAttempt) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Тест әрекетінің қорытындысы:\n");
        prompt.append("Студент: ").append(quizAttempt.getStudent().getFirstname()).append("\n");
        prompt.append("Тест тақырыбы: ").append(quizAttempt.getQuiz().getTitle()).append("\n");
        prompt.append("Әрекет нөмірі: ").append(quizAttempt.getAttemptNumber()).append("\n");
        prompt.append("Ұпай: ").append(quizAttempt.getScore()).append("/100\n\n");

        prompt.append("Жауаптар:\n");

        for (QuizAttemptAnswer attemptAnswer : quizAttempt.getAttemptAnswers()) {
            Question question = attemptAnswer.getQuestion();

            String correctAnswerText = question.getAnswers().stream()
                .filter(Answer::isCorrect)
                .map(Answer::getAnswerText)
                .findFirst()
                .orElse("Дұрыс жауап табылмады");

            prompt.append("- Сұрақ: ").append(question.getQuestionText()).append("\n");
            prompt.append("  Студенттің жауабы: ").append(attemptAnswer.getAnswer().getAnswerText()).append("\n");
            prompt.append("  Дұрыс жауап: ").append(correctAnswerText).append("\n");
            prompt.append("  Нәтиже: ").append(attemptAnswer.isCorrect() ? "✅ Дұрыс" : "❌ Қате").append("\n\n");

            prompt.append("  🧐 Түсіндірме:\n");

            if (!attemptAnswer.isCorrect()) {
                prompt.append("  ❌ Студент бұл сұраққа қате жауап берді. Қатенің себебін анықтап, егжей-тегжейлі түсіндірме жаса. Неге бұл жауап дұрыс емес? Қандай қате ойлау тәсілі немесе түсінбеушілік болуы мүмкін?\n\n");
                prompt.append("  ✅ Дұрыс жауаптың мәнін түсіндір. Неге бұл жауап дұрыс? Қандай фактілер, логика немесе теориялық негіздер бұл жауапты растайды?\n\n");
            } else {
                prompt.append("  ✅ Студент дұрыс жауап берді. Бірақ қосымша пайдалы ақпарат бер. Бұл сұраққа байланысты басқа қандай маңызды мәліметтер бар? Мысалы, тарихи контекст, формула, ережелер немесе нақты қолдану мысалдары.\n\n");
            }
        }

        prompt.append("📌 Соңында, студент қай тақырыптарды қайта қарауы керек екенін атап өт. Қандай білім олқылықтары байқалады?\n");
        prompt.append("📌 Түсіндірмені нақты әрі мазмұнды етіп жаса. Қысқа жауаптардан аулақ бол.\n");

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
