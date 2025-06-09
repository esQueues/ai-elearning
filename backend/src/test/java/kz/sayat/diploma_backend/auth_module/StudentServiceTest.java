package kz.sayat.diploma_backend.auth_module;

import kz.sayat.diploma_backend.auth_module.dto.PasswordDto;
import kz.sayat.diploma_backend.auth_module.dto.StudentDto;
import kz.sayat.diploma_backend.auth_module.models.Student;
import kz.sayat.diploma_backend.auth_module.service.StudentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;

import java.util.Collections;
import java.util.List;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StudentServiceTest {

    @Mock
    private StudentService studentService;

    @Mock
    private Authentication authentication;

    @Mock
    private Student student;

    @Mock
    private StudentDto studentDto;

    @Mock
    private PasswordDto passwordDto;

    @BeforeEach
    void setUp() {
        // No specific setup needed for interface testing, mocks are sufficient
    }

    @Test
    void save_CanInvokeWithStudent() {
        studentService.save(student);
        verify(studentService).save(student);
    }

    @Test
    void getProfile_CanInvokeWithAuthentication() {
        studentService.getProfile(authentication);
        verify(studentService).getProfile(authentication);
    }

    @Test
    void getById_CanInvokeWithId() {
        studentService.getById(1);
        verify(studentService).getById(1);
    }

    @Test
    void updateStudent_CanInvokeWithAuthenticationAndStudentDto() {
        studentService.updateStudent(authentication, studentDto);
        verify(studentService).updateStudent(authentication, studentDto);
    }

    @Test
    void deleteStudent_CanInvokeWithId() {
        studentService.deleteStudent(1);
        verify(studentService).deleteStudent(1);
    }

    @Test
    void getAllStudents_CanInvoke() {
        studentService.getAllStudents();
        verify(studentService).getAllStudents();
    }

    @Test
    void getStudentFromUser_CanInvokeWithAuthentication() {
        studentService.getStudentFromUser(authentication);
        verify(studentService).getStudentFromUser(authentication);
    }

    @Test
    void changePassword_CanInvokeWithAuthenticationAndPasswordDto() {
        studentService.changePassword(authentication, passwordDto);
        verify(studentService).changePassword(authentication, passwordDto);
    }
}