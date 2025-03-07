package kz.sayat.diploma_backend.auth_module.service;

import kz.sayat.diploma_backend.auth_module.dto.PasswordDto;
import kz.sayat.diploma_backend.auth_module.dto.StudentDto;
import kz.sayat.diploma_backend.auth_module.models.Student;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface StudentService {
    void save(Student student);
    StudentDto getProfile(Authentication authentication);
    StudentDto getById(int id);
    StudentDto updateStudent(Authentication authentication, StudentDto studentDto);
    void deleteStudent(int id);
    List<StudentDto> getAllStudents();
    Student getStudentFromUser(Authentication authentication);
    void changePassword(Authentication authentication, PasswordDto changePasswordDto);
}
