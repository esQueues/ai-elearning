package kz.sayat.diploma_backend.course_module.service;

import kz.sayat.diploma_backend.auth_module.dto.StudentDto;
import kz.sayat.diploma_backend.course_module.dto.CourseDto;
import kz.sayat.diploma_backend.course_module.dto.CourseSummaryDto;
import kz.sayat.diploma_backend.course_module.models.Course;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.Optional;

public interface CourseService {

    CourseDto createCourse(CourseDto dto, Authentication authentication);

    CourseDto findCourseById(int id, Authentication auth);

    void enrollCourse(int courseId, Authentication authentication);

    List<CourseSummaryDto> getMyCourses(Authentication authentication);

    List<CourseSummaryDto> getAllCourses();

    void deleteCourse(int id);

    List<StudentDto> getStudentForCourse(int id);

    List<CourseSummaryDto> getCourses(String search);

    void approve(int id);

    List<CourseSummaryDto> getPrivateCourses();

    void disallow(int id);

    void editCourse(CourseDto dto, int id);

    List<CourseSummaryDto> getCompletedCourses(Authentication authentication);
}
