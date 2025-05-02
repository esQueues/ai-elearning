package kz.sayat.diploma_backend.quiz_module.repository;

import kz.sayat.diploma_backend.quiz_module.models.Feedback;
import kz.sayat.diploma_backend.quiz_module.models.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback,Integer> {
    Optional<Feedback> findByQuizAttempt(QuizAttempt attempt);
}
