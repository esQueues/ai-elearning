package kz.sayat.diploma_backend.course_module.repository;

import kz.sayat.diploma_backend.course_module.models.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ModuleRepository extends JpaRepository<Module, Integer> {
    @Query("SELECT m FROM Module m WHERE m.course.id = :courseId")
    List<Module> findByCourseId(@Param("courseId") int courseId);
}
