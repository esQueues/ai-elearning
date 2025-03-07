package kz.sayat.diploma_backend.course_module.repository;

import kz.sayat.diploma_backend.course_module.models.Lecture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LectureRepository extends JpaRepository<Lecture, Integer> {
    List<Lecture> findByModule_Id(Integer moduleId);
    @Modifying
    @Query("DELETE FROM Lecture l WHERE l.module.id = :moduleId")
    void deleteByModuleId(@Param("moduleId") int moduleId);

}
