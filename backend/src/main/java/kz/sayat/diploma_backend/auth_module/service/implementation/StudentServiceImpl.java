package kz.sayat.diploma_backend.auth_module.service.implementation;

import jakarta.transaction.Transactional;
import kz.sayat.diploma_backend.auth_module.dto.PasswordDto;
import kz.sayat.diploma_backend.auth_module.dto.StudentDto;
import kz.sayat.diploma_backend.auth_module.service.StudentService;
import kz.sayat.diploma_backend.util.exceptions.UnauthorizedException;
import kz.sayat.diploma_backend.auth_module.mapper.StudentMapper;
import kz.sayat.diploma_backend.auth_module.models.Student;
import kz.sayat.diploma_backend.auth_module.models.User;
import kz.sayat.diploma_backend.auth_module.repository.StudentRepository;
import kz.sayat.diploma_backend.auth_module.security.MyUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final StudentMapper studentMapper;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    @Override
    public void save(Student student) {
        student.setPassword(encoder.encode(student.getPassword()));
        studentRepository.save(student);
    }

    @Override
    public StudentDto getProfile(Authentication authentication) {
        Student student = getStudentFromUser(authentication);
        return studentMapper.toStudentDto(student);
    }

    @Override
    public StudentDto getById(int id) {
        Student student = studentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Student not found"));
        return studentMapper.toStudentDto(student);
    }

    @Override
    public StudentDto updateStudent(Authentication authentication, StudentDto studentDto) {
        Student student = getStudentFromUser(authentication);

        student.setBirthDate(studentDto.getBirthday());
        student.setGradeLevel(studentDto.getGradeLevel());
        student.setFirstname(studentDto.getFirstname());
        student.setLastname(studentDto.getLastname());
        student.setSchoolInfo(studentDto.getSchoolInfo());

        studentRepository.save(student);

        return studentMapper.toStudentDto(student);
    }

    @Override
    public void deleteStudent(int id) {
        Student student = studentRepository.findById(id).orElseThrow(() ->
            new RuntimeException("Student not found"));
        studentRepository.delete(student);
    }

    @Override
    public List<StudentDto> getAllStudents() {
        List<Student>students = studentRepository.findAll();

        return studentMapper.toStudentDtoList(students);
    }

    @Override
    public Student getStudentFromUser(Authentication authentication){
        if(!authentication.isAuthenticated()){
            throw new UnauthorizedException("User is not authenticated");
        }
        MyUserDetails userDetails = (MyUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();
        if (!(user instanceof Student student)) {
            throw new RuntimeException("User is not a student");
        }
        return student;
    }

    @Override
    public void changePassword(Authentication authentication, PasswordDto changePasswordDto) {
        Student student= getStudentFromUser(authentication);
        if (!encoder.matches(changePasswordDto.getOldPassword(), student.getPassword())) {
            throw new IllegalArgumentException("Old password is incorrect.");
        }
        student.setPassword(encoder.encode(changePasswordDto.getNewPassword()));
        studentRepository.save(student);
    }
}
