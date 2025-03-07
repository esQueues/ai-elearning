package kz.sayat.diploma_backend.auth_module.mapper;

import kz.sayat.diploma_backend.auth_module.security.dto.RegisterRequest;
import kz.sayat.diploma_backend.auth_module.dto.StudentDto;
import kz.sayat.diploma_backend.auth_module.models.Student;

import java.util.List;

public interface StudentMapper {

    Student toStudent(RegisterRequest registerRequest);

    Student toStudent(StudentDto studentDto);

    StudentDto toStudentDto(Student student);

    List<StudentDto> toStudentDtoList(List<Student> students);

}
