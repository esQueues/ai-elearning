package kz.sayat.diploma_backend.course_module.repository;

import kz.sayat.diploma_backend.auth_module.models.Student;
import kz.sayat.diploma_backend.course_module.models.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Integer>, JpaSpecificationExecutor<Course> {
    List<Course> findByTitleContainingIgnoreCaseAndIsPublicTrue(String name);
    List<Course> findByIsPublicTrueAndTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
            String titleKeyword, String descriptionKeyword);
    List<Course> findByIsPublicTrue();
    List<Course> findByIsPublicFalse();
}
