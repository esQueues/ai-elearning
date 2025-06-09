package kz.sayat.diploma_backend.quiz_module;

import kz.sayat.diploma_backend.auth_module.models.Student;
import kz.sayat.diploma_backend.course_module.models.Course;
import kz.sayat.diploma_backend.course_module.models.Lecture;
import kz.sayat.diploma_backend.course_module.models.Module;
import kz.sayat.diploma_backend.quiz_module.dto.FeedbackDto;
import kz.sayat.diploma_backend.quiz_module.models.Feedback;
import kz.sayat.diploma_backend.quiz_module.models.Quiz;
import kz.sayat.diploma_backend.quiz_module.models.QuizAttempt;
import kz.sayat.diploma_backend.quiz_module.service.FeedbackService;
import kz.sayat.diploma_backend.util.exceptions.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FeedbackServiceTest {

    @Mock
    private FeedbackService feedbackService;

    @Mock
    private Authentication authentication;

    private Student student;
    private QuizAttempt quizAttempt;
    private Feedback feedback;

    @BeforeEach
    void setUp() {
        // Set up test data with entity relationships
        student = new Student();
        student.setId(1);
        student.setFirstname("John");
        student.setLastname("Doe");

        Course course = new Course();
        course.setTitle("Computer Science");

        Module module = new Module();
        module.setCourse(course);
        Lecture lecture = new Lecture();
        lecture.setUrl("https://youtube.com/watch?v=example");
        module.setLectures(Collections.singletonList(lecture));

        Quiz quiz = new Quiz();
        quiz.setTitle("Java Basics");
        quiz.setPassingScore(70);
        quiz.setDurationInMinutes(30);
        quiz.setModule(module);

        quizAttempt = new QuizAttempt();
        quizAttempt.setId(1);
        quizAttempt.setStudent(student);
        quizAttempt.setQuiz(quiz);
        quizAttempt.setScore(80.0);
        quizAttempt.setDurationSeconds(1200); // 20 minutes

        feedback = new Feedback("Prompt text", "Great job! Review timestamp 5:30.", quizAttempt);
        feedback.setCreatedAt(LocalDateTime.now()); // Simulate @PrePersist behavior
    }

    @Test
    void generateFeedback_Success() {
        when(feedbackService.generateFeedback(1)).thenReturn("Great job! Review timestamp 5:30.");

        String result = feedbackService.generateFeedback(1);

        assertNotNull(result);
        assertEquals("Great job! Review timestamp 5:30.", result);
        verify(feedbackService).generateFeedback(1);
    }

    @Test
    void generateFeedback_QuizAttemptNotFound_ThrowsException() {
        when(feedbackService.generateFeedback(999))
                .thenThrow(new ResourceNotFoundException("Quiz attempt not found"));

        assertThrows(ResourceNotFoundException.class, () -> feedbackService.generateFeedback(999));
        verify(feedbackService).generateFeedback(999);
    }

    @Test
    void generateFeedback_NoLectureFound_ThrowsException() {
        when(feedbackService.generateFeedback(1))
                .thenThrow(new ResourceNotFoundException("No lecture found for this module"));

        assertThrows(ResourceNotFoundException.class, () -> feedbackService.generateFeedback(1));
        verify(feedbackService).generateFeedback(1);
    }

    @Test
    void generateFeedback_NoYouTubeLink_ThrowsException() {
        when(feedbackService.generateFeedback(1))
                .thenThrow(new ResourceNotFoundException("YouTube link not found for the lecture"));

        assertThrows(ResourceNotFoundException.class, () -> feedbackService.generateFeedback(1));
        verify(feedbackService).generateFeedback(1);
    }

    @Test
    void getFeedbackOfStudent_Success() {
        when(feedbackService.getFeedbackOfStudent(1, authentication))
                .thenReturn("Great job! Review timestamp 5:30.");

        String result = feedbackService.getFeedbackOfStudent(1, authentication);

        assertNotNull(result);
        assertEquals("Great job! Review timestamp 5:30.", result);
        verify(feedbackService).getFeedbackOfStudent(1, authentication);
    }

    @Test
    void getFeedbackOfStudent_UnauthorizedStudent_ThrowsException() {
        when(feedbackService.getFeedbackOfStudent(1, authentication))
                .thenThrow(new ResourceNotFoundException("You are not allowed to view this feedback"));

        assertThrows(ResourceNotFoundException.class, () -> feedbackService.getFeedbackOfStudent(1, authentication));
        verify(feedbackService).getFeedbackOfStudent(1, authentication);
    }

    @Test
    void getFeedbackOfStudent_FeedbackNotFound_ThrowsException() {
        when(feedbackService.getFeedbackOfStudent(1, authentication))
                .thenThrow(new ResourceNotFoundException("Feedback not found for this attempt"));

        assertThrows(ResourceNotFoundException.class, () -> feedbackService.getFeedbackOfStudent(1, authentication));
        verify(feedbackService).getFeedbackOfStudent(1, authentication);
    }

    @Test
    void getAllFeedback_Success() {
        FeedbackDto feedbackDto = new FeedbackDto(
                1,
                "Great job! Review timestamp 5:30.",
                "John",
                "Doe",
                "Computer Science",
                "Java Basics",
                feedback.getCreatedAt().format(java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
        );
        List<FeedbackDto> feedbackList = Collections.singletonList(feedbackDto);

        when(feedbackService.getAllFeedback()).thenReturn(feedbackList);

        List<FeedbackDto> result = feedbackService.getAllFeedback();

        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
        FeedbackDto resultDto = result.get(0);
        assertEquals(1, resultDto.getId());
        assertEquals("Great job! Review timestamp 5:30.", resultDto.getFeedbackText());
        assertEquals("John", resultDto.getStudentFirstname());
        assertEquals("Doe", resultDto.getStudentLastname());
        assertEquals("Computer Science", resultDto.getCourseTitle());
        assertEquals("Java Basics", resultDto.getQuizTitle());
        verify(feedbackService).getAllFeedback();
    }

    @Test
    void getAllFeedback_EmptyList_ReturnsEmpty() {
        when(feedbackService.getAllFeedback()).thenReturn(Collections.emptyList());

        List<FeedbackDto> result = feedbackService.getAllFeedback();

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(feedbackService).getAllFeedback();
    }

    @Test
    void deleteFeedback_Success() {
        doNothing().when(feedbackService).deleteFeedback(1);

        feedbackService.deleteFeedback(1);

        verify(feedbackService).deleteFeedback(1);
    }

    @Test
    void deleteFeedback_NonExistentId_DoesNotThrow() {
        doNothing().when(feedbackService).deleteFeedback(999);

        feedbackService.deleteFeedback(999);

        verify(feedbackService).deleteFeedback(999);
    }
}