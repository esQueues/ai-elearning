package kz.sayat.diploma_backend.quiz_module.repository;

import kz.sayat.diploma_backend.auth_module.models.Student;
import kz.sayat.diploma_backend.quiz_module.models.Quiz;
import kz.sayat.diploma_backend.quiz_module.models.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Integer> {

    List<QuizAttempt> findByStudentAndQuiz(Student student, Quiz quiz);
    QuizAttempt findTopByStudentAndQuizOrderByAttemptNumberDesc(Student student, Quiz quiz);
}
