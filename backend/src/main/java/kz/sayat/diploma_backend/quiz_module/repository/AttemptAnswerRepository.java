package kz.sayat.diploma_backend.quiz_module.repository;

import jakarta.persistence.criteria.CriteriaBuilder;
import kz.sayat.diploma_backend.quiz_module.models.QuizAttemptAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AttemptAnswerRepository extends JpaRepository<QuizAttemptAnswer, Integer> {
}
