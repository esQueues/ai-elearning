package kz.sayat.diploma_backend.course_module;

import kz.sayat.diploma_backend.auth_module.dto.StudentDto;
import kz.sayat.diploma_backend.auth_module.models.Student;
import kz.sayat.diploma_backend.auth_module.models.Teacher;
import kz.sayat.diploma_backend.auth_module.models.User;
import kz.sayat.diploma_backend.auth_module.models.enums.UserRole;
import kz.sayat.diploma_backend.auth_module.repository.StudentRepository;
import kz.sayat.diploma_backend.auth_module.repository.TeacherRepository;
import kz.sayat.diploma_backend.auth_module.security.MyUserDetails;
import kz.sayat.diploma_backend.auth_module.service.StudentService;
import kz.sayat.diploma_backend.auth_module.service.TeacherService;
import kz.sayat.diploma_backend.course_module.dto.CourseDto;
import kz.sayat.diploma_backend.course_module.dto.CourseSummaryDto;
import kz.sayat.diploma_backend.course_module.dto.LectureDto;
import kz.sayat.diploma_backend.course_module.dto.ModuleDto;
import kz.sayat.diploma_backend.course_module.dto.QuizSummaryDto;
import kz.sayat.diploma_backend.course_module.models.Course;
import kz.sayat.diploma_backend.course_module.models.Enrollment;
import kz.sayat.diploma_backend.course_module.models.EnrollmentId;
import kz.sayat.diploma_backend.course_module.models.Lecture;
import kz.sayat.diploma_backend.course_module.models.Module;
import kz.sayat.diploma_backend.course_module.repository.CourseRepository;
import kz.sayat.diploma_backend.course_module.repository.EnrollmentRepository;
import kz.sayat.diploma_backend.course_module.repository.LectureRepository;
import kz.sayat.diploma_backend.course_module.repository.LectureViewRepository;
import kz.sayat.diploma_backend.course_module.repository.ModuleRepository;
import kz.sayat.diploma_backend.course_module.mapper.CourseMapper;
import kz.sayat.diploma_backend.course_module.service.CourseService;
import kz.sayat.diploma_backend.course_module.service.implementations.CourseServiceImpl;
import kz.sayat.diploma_backend.quiz_module.models.Quiz;
import kz.sayat.diploma_backend.quiz_module.models.QuizAttempt;
import kz.sayat.diploma_backend.quiz_module.repository.QuizAttemptRepository;
import kz.sayat.diploma_backend.quiz_module.repository.QuizRepository;
import kz.sayat.diploma_backend.util.exceptions.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CourseServiceTest {

    @Mock
    private CourseRepository courseRepository;
    @Mock
    private TeacherRepository teacherRepository;
    @Mock
    private StudentService studentService;
    @Mock
    private TeacherService teacherService;
    @Mock
    private StudentRepository studentRepository;
    @Mock
    private CourseMapper courseMapper;
    @Mock
    private kz.sayat.diploma_backend.auth_module.mapper.StudentMapper studentMapper;
    @Mock
    private ModuleRepository moduleRepository;
    @Mock
    private EnrollmentRepository enrollmentRepository;
    @Mock
    private QuizRepository quizRepository;
    @Mock
    private QuizAttemptRepository quizAttemptRepository;
    @Mock
    private LectureViewRepository lectureViewRepository;
    @Mock
    private LectureRepository lectureRepository;
    @Mock
    private Authentication authentication;
    @Mock
    private MultipartFile multipartFile;

    @InjectMocks
    private CourseServiceImpl courseService;

    private CourseService service;
    private Course course;
    private CourseDto courseDto;
    private CourseSummaryDto courseSummaryDto;
    private Student student;
    private Teacher teacher;
    private User user;
    private MyUserDetails userDetails;

    @BeforeEach
    void setUp() {
        service = courseService;

        course = new Course();
        course.setId(1);
        course.setTitle("Test Course");
        course.setDescription("Test Description");
        course.setPublic(true);

        courseDto = new CourseDto();
        courseDto.setId(1);
        courseDto.setTitle("Test Course");
        courseDto.setDescription("Test Description");
        courseDto.setModules(new ArrayList<>());

        courseSummaryDto = new CourseSummaryDto();
        courseSummaryDto.setId(1);
        courseSummaryDto.setTitle("Test Course");
        courseSummaryDto.setProgress(0.0);

        student = new Student();
        student.setId(1);
        student.setEmail("student@example.com");
        student.setFirstname("John");
        student.setLastname("Doe");

        teacher = new Teacher();
        teacher.setId(1);

        user = new Student();
        user.setId(1);
        user.setRole(UserRole.STUDENT);
        userDetails = new MyUserDetails(user);
    }

    @Test
    void createCourse_Success() {
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(teacherRepository.findById(1)).thenReturn(Optional.of(teacher));
        when(courseMapper.toCourse(any(CourseDto.class))).thenReturn(course);
        when(courseRepository.save(any(Course.class))).thenReturn(course);
        when(courseMapper.toCourseDto(any(Course.class))).thenReturn(courseDto);

        CourseDto result = service.createCourse(courseDto, authentication);

        assertNotNull(result);
        assertEquals(courseDto.getTitle(), result.getTitle());
        verify(courseRepository).save(any(Course.class));
    }

    @Test
    void createCourse_TeacherNotFound_ThrowsException() {
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(teacherRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.createCourse(courseDto, authentication));
    }

//    @Test
//    void findCourseById_Success_StudentEnrolled() {
//        Module module = new Module();
//        module.setId(1);
//        course.setModules(new ArrayList<>(List.of(module)));
//
//        when(authentication.isAuthenticated()).thenReturn(true);
//        when(authentication.getPrincipal()).thenReturn(userDetails);
//        when(courseRepository.findById(1)).thenReturn(Optional.of(course));
//        lenient().when(studentService.getStudentFromUser(authentication)).thenReturn(student);
//        lenient().when(enrollmentRepository.existsByStudentAndCourse(student, course)).thenReturn(true);
//        lenient().when(courseMapper.toCourseDto(course)).thenReturn(courseDto);
//        when(moduleRepository.findByCourseId(1)).thenReturn(new ArrayList<>(List.of(module)));
//        lenient().when(lectureRepository.findByModuleId(1)).thenReturn(new ArrayList<>());
//        lenient().when(quizRepository.findByModuleId(1)).thenReturn(new ArrayList<>());
//
//        CourseDto result = service.findCourseById(1, authentication);
//
//        assertNotNull(result);
//        assertTrue(result.isEnrolled());
//        verify(courseRepository).findById(1);
//    }

    @Test
    void findCourseById_CourseNotFound_ThrowsException() {
        when(courseRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.findCourseById(1, authentication));
    }

    @Test
    void enrollCourse_Success() {
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(courseRepository.findById(1)).thenReturn(Optional.of(course));
        when(enrollmentRepository.existsById(any(EnrollmentId.class))).thenReturn(false);

        service.enrollCourse(1, authentication);

        verify(enrollmentRepository).save(any(Enrollment.class));
    }

    @Test
    void enrollCourse_AlreadyEnrolled_ThrowsException() {
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(courseRepository.findById(1)).thenReturn(Optional.of(course));
        when(enrollmentRepository.existsById(any(EnrollmentId.class))).thenReturn(true);

        assertThrows(RuntimeException.class, () -> service.enrollCourse(1, authentication));
    }


    @Test
    void getAllCourses_Success() {
        List<Course> courses = new ArrayList<>(List.of(course));
        when(courseRepository.findAll()).thenReturn(courses);
        when(courseMapper.toCourseSummaryDtoList(courses)).thenReturn(List.of(courseSummaryDto));

        List<CourseSummaryDto> result = service.getAllCourses();

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(courseRepository).findAll();
    }

    @Test
    void getStudentForCourse_Success() {
        List<Student> students = new ArrayList<>(List.of(student));
        List<StudentDto> studentDtos = List.of(new StudentDto());
        when(enrollmentRepository.findStudentsByCourseId(1)).thenReturn(students);
        when(studentMapper.toStudentDtoList(students)).thenReturn(studentDtos);

        List<StudentDto> result = service.getStudentForCourse(1);

        assertNotNull(result);
        assertEquals(studentDtos.size(), result.size());
        verify(enrollmentRepository).findStudentsByCourseId(1);
    }

    @Test
    void getCoursesByQuery_Success() {
        List<Course> courses = new ArrayList<>(List.of(course));
        when(courseRepository.findByIsPublicTrueAndTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase("test", "test"))
                .thenReturn(courses);
        when(courseMapper.toCourseSummaryDtoList(courses)).thenReturn(List.of(courseSummaryDto));

        List<CourseSummaryDto> result = service.getCoursesByQuery("test");

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(courseRepository).findByIsPublicTrueAndTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase("test", "test");
    }

    @Test
    void approve_Success() {
        when(courseRepository.findById(1)).thenReturn(Optional.of(course));

        service.approve(1);

        assertTrue(course.isPublic());
        verify(courseRepository).findById(1);
    }

    @Test
    void approve_CourseNotFound_ThrowsException() {
        when(courseRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.approve(1));
    }

    @Test
    void getPrivateCourses_Success() {
        List<Course> courses = new ArrayList<>(List.of(course));
        when(courseRepository.findByIsPublicFalse()).thenReturn(courses);
        when(courseMapper.toCourseSummaryDtoList(courses)).thenReturn(List.of(courseSummaryDto));

        List<CourseSummaryDto> result = service.getPrivateCourses();

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(courseRepository).findByIsPublicFalse();
    }

    @Test
    void disallow_Success() {
        when(courseRepository.findById(1)).thenReturn(Optional.of(course));

        service.disallow(1);

        assertFalse(course.isPublic());
        verify(courseRepository).findById(1);
    }

    @Test
    void editCourse_Success() {
        when(courseRepository.findById(1)).thenReturn(Optional.of(course));

        service.editCourse(courseDto, 1);

        assertEquals(courseDto.getTitle(), course.getTitle());
        assertEquals(courseDto.getDescription(), course.getDescription());
        verify(courseRepository).findById(1);
    }

    @Test
    void editCourse_CourseNotFound_ThrowsException() {
        when(courseRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.editCourse(courseDto, 1));
    }



    @Test
    void saveFile_Success() throws IOException {
        when(courseRepository.findById(1)).thenReturn(Optional.of(course));
        when(multipartFile.getOriginalFilename()).thenReturn("test.jpg");
        when(multipartFile.getInputStream()).thenReturn(new ByteArrayInputStream(new byte[0]));

        service.saveFile(1, multipartFile);

        verify(courseRepository).save(any(Course.class));
    }



    @Test
    void getProfileImageId_NoImage_ThrowsException() {
        course.setProfileImagePath(null);
        when(courseRepository.findById(1)).thenReturn(Optional.of(course));

        assertThrows(FileNotFoundException.class, () -> service.getProfileImageId(1));
    }


    @Test
    void getCoursesByCategory_InvalidCategory_ThrowsException() {
        assertThrows(IllegalArgumentException.class, () -> service.getCoursesByCategory(List.of("INVALID")));
    }
}