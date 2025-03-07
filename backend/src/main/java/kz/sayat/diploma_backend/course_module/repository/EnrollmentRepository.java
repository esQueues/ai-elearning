package kz.sayat.diploma_backend.course_module.repository;

import kz.sayat.diploma_backend.auth_module.models.Student;
import kz.sayat.diploma_backend.course_module.models.Course;
import kz.sayat.diploma_backend.course_module.models.Enrollment;
import kz.sayat.diploma_backend.course_module.models.EnrollmentId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EnrollmentRepository extends JpaRepository<Enrollment, EnrollmentId> {
    boolean existsByStudentAndCourse(Student student, Course course);
    @Query("SELECT e.student FROM Enrollment e WHERE e.course.id = :courseId")
    List<Student> findStudentsByCourseId(@Param("courseId") int courseId);

    @Query("SELECT e.course FROM Enrollment e WHERE e.student.id = :studentId")
    List<Course> findCoursesByStudentId(@Param("studentId") int studentId);

}

