package kz.sayat.diploma_backend.auth_module.service;

import kz.sayat.diploma_backend.auth_module.dto.PasswordDto;
import kz.sayat.diploma_backend.auth_module.dto.TeacherDto;
import kz.sayat.diploma_backend.auth_module.models.Teacher;
import kz.sayat.diploma_backend.course_module.dto.CourseSummaryDto;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface TeacherService {
    void save(Teacher teacher);
    TeacherDto getProfile(Authentication authentication);
    void updateTeacher(Authentication authentication, TeacherDto teacherDto);
    void deleteTeacher(int id);
    TeacherDto getTeacherById(int id);
    List<TeacherDto> getAllTeachers();
    Teacher getTeacherFromUser(Authentication authentication);
    List<CourseSummaryDto> getCreatedCourses(Authentication authentication);
    void changePassword(Authentication authentication, PasswordDto changePasswordDto);
}
