    package kz.sayat.diploma_backend.auth_module.mapper.implementation;

    import kz.sayat.diploma_backend.auth_module.security.dto.RegisterRequest;
    import kz.sayat.diploma_backend.auth_module.dto.StudentDto;
    import kz.sayat.diploma_backend.auth_module.mapper.StudentMapper;
    import kz.sayat.diploma_backend.auth_module.models.Student;
    import kz.sayat.diploma_backend.auth_module.models.enums.UserRole;
    import kz.sayat.diploma_backend.course_module.dto.CourseSummaryDto;
    import kz.sayat.diploma_backend.course_module.mapper.CourseMapper;
    import kz.sayat.diploma_backend.course_module.repository.EnrollmentRepository;
    import lombok.RequiredArgsConstructor;
    import org.springframework.stereotype.Component;

    import java.util.List;
    import java.util.stream.Collectors;

    @Component
    @RequiredArgsConstructor
    public class StudentMapperImpl implements StudentMapper {

        private final CourseMapper courseMapper;
        private final EnrollmentRepository enrollmentRepository; // 🛠️ Добавляем репозиторий

        @Override
        public Student toStudent(RegisterRequest registerRequest) {
            if (registerRequest == null) {
                return null;
            }
            Student student = new Student();
            student.setEmail(registerRequest.email());
            student.setPassword(registerRequest.password());
            student.setFirstname(registerRequest.firstname());
            student.setLastname(registerRequest.lastname());
            student.setGradeLevel(registerRequest.gradeLevel());
            student.setBirthDate(registerRequest.birthDate());
            student.setSchoolInfo(registerRequest.schoolInfo());
            student.setRole(UserRole.STUDENT);
            return student;
        }

        @Override
        public Student toStudent(StudentDto studentDto) {
            if(studentDto == null) {
                return null;
            }
            return null;
    //        Student student = new Student();
    //        student.setEmail(studentDto.getEmail());
    //        student.setSchoolInfo(studentDto.getSchoolInfo());
    //        student.setFirstname(studentDto.getFirstname());
    //        student.setLastname(studentDto.getLastname());
    //        student.setGradeLevel(studentDto.getGradeLevel());
    //        student.setCourses(studentDto.getEnrolledCourses());
        }

        @Override
        public StudentDto toStudentDto(Student student) {
            if (student == null) {
                return null;
            }
            StudentDto studentDto = new StudentDto();
            studentDto.setId(student.getId());
            studentDto.setEmail(student.getEmail());
            studentDto.setFirstname(student.getFirstname());
            studentDto.setLastname(student.getLastname());
            studentDto.setGradeLevel(student.getGradeLevel());
            studentDto.setSchoolInfo(student.getSchoolInfo());
            studentDto.setBirthday(student.getBirthDate());

            List<CourseSummaryDto> enrolledCourses = enrollmentRepository.findCoursesByStudentId(student.getId())
                .stream()
                .map(courseMapper::toCourseSummaryDto)
                .toList();
            studentDto.setEnrolledCourses(enrolledCourses);

            return studentDto;
        }

        @Override
        public List<StudentDto> toStudentDtoList(List<Student> students) {
            return students.stream().map(
                this:: toStudentDto
            ).collect(Collectors.toList());
        }
    }
