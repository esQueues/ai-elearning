package kz.sayat.diploma_backend.course_module.repository;

import kz.sayat.diploma_backend.auth_module.models.User;
import kz.sayat.diploma_backend.course_module.models.Lecture;
import kz.sayat.diploma_backend.course_module.models.LectureView;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LectureViewRepository extends JpaRepository<LectureView, Integer> {
    boolean existsByStudentIdAndLectureId(int studentId, int lectureId);
}

