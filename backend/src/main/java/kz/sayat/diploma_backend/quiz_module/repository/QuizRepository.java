package kz.sayat.diploma_backend.quiz_module.repository;

import kz.sayat.diploma_backend.quiz_module.models.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Integer> {

    List<Quiz> findQuizzesByModule_Id(Integer moduleId);
    @Modifying
    @Query("DELETE FROM Quiz q WHERE q.module.id = :moduleId")
    void deleteByModuleId(@Param("moduleId") int moduleId);

    @Query("SELECT COUNT(q) FROM Quiz q WHERE q.module.id = :moduleId")
    int countByModuleId(@Param("moduleId") int moduleId);
}
