package kz.sayat.diploma_backend.auth_module.controller;

import jakarta.validation.Valid;
import kz.sayat.diploma_backend.auth_module.dto.PasswordDto;
import kz.sayat.diploma_backend.auth_module.dto.StudentDto;
import kz.sayat.diploma_backend.auth_module.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @GetMapping("/profile")
    public ResponseEntity<StudentDto> getProfile(Authentication authentication) {
        return ResponseEntity.ok().body(studentService.getProfile(authentication));
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentDto> getStudentById(@PathVariable int id) {
        return ResponseEntity.ok( studentService.getById(id));
    }


    @PutMapping("/profile/update")
    public ResponseEntity<StudentDto> update(@Valid @RequestBody StudentDto studentDto,
                                             Authentication authentication) {
        return ResponseEntity.ok(studentService.updateStudent(authentication, studentDto));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteStudent(@PathVariable int id) {
        studentService.deleteStudent(id);
    }


    @GetMapping("/all")
    public ResponseEntity<List<StudentDto>> getAllTeachers() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @PutMapping("/profile/change-password")
    @ResponseStatus(HttpStatus.OK)
    public void changePassword(@RequestBody PasswordDto changePasswordDto,
                               Authentication authentication) {
        studentService.changePassword(authentication, changePasswordDto);
    }
}
