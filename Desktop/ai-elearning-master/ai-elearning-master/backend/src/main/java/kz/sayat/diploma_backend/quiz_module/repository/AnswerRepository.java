package kz.sayat.diploma_backend.quiz_module.repository;

import kz.sayat.diploma_backend.quiz_module.models.Answer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnswerRepository extends JpaRepository<Answer,Integer> {
}
