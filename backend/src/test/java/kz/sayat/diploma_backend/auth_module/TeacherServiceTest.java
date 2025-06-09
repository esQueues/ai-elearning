package kz.sayat.diploma_backend.auth_module;

import kz.sayat.diploma_backend.auth_module.dto.PasswordDto;
import kz.sayat.diploma_backend.auth_module.dto.TeacherDto;
import kz.sayat.diploma_backend.auth_module.mapper.TeacherMapper;
import kz.sayat.diploma_backend.auth_module.models.Teacher;
import kz.sayat.diploma_backend.auth_module.models.User;
import kz.sayat.diploma_backend.auth_module.repository.TeacherRepository;
import kz.sayat.diploma_backend.auth_module.security.MyUserDetails;
import kz.sayat.diploma_backend.auth_module.service.implementation.TeacherServiceImpl;
import kz.sayat.diploma_backend.course_module.dto.CourseSummaryDto;
import kz.sayat.diploma_backend.course_module.mapper.CourseMapper;
import kz.sayat.diploma_backend.course_module.models.Course;
import kz.sayat.diploma_backend.util.exceptions.ResourceNotFoundException;
import kz.sayat.diploma_backend.util.exceptions.UnauthorizedException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.core.Authentication;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.*;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TeacherServiceTest {

    @InjectMocks
    private TeacherServiceImpl teacherService;

    @Mock
    private TeacherRepository teacherRepository;

    @Mock
    private TeacherMapper teacherMapper;

    @Mock
    private CourseMapper courseMapper;

    @Mock
    private Authentication authentication;

    private Teacher mockTeacher;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        mockTeacher = new Teacher();
        mockTeacher.setId(1);
        mockTeacher.setPassword(new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder().encode("oldPass"));

        User user = mockTeacher;
        MyUserDetails userDetails = new MyUserDetails(user);

        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(authentication.isAuthenticated()).thenReturn(true);
    }

    @Test
    void testSave() {
        Teacher newTeacher = new Teacher();
        newTeacher.setPassword("rawPass");

        teacherService.save(newTeacher);

        assertNotEquals("rawPass", newTeacher.getPassword());
        verify(teacherRepository).save(newTeacher);
    }

    @Test
    void testGetProfile() {
        when(teacherRepository.findById(1)).thenReturn(Optional.of(mockTeacher));
        when(teacherMapper.toTeacherDto(mockTeacher)).thenReturn(new TeacherDto());

        TeacherDto dto = teacherService.getProfile(authentication);
        assertNotNull(dto);
    }

    @Test
    void testUpdateTeacher() {
        when(teacherRepository.findById(1)).thenReturn(Optional.of(mockTeacher));
        TeacherDto dto = new TeacherDto();
        dto.setFirstname("Updated");
        dto.setLastname("Teacher");

        teacherService.updateTeacher(authentication, dto);

        assertEquals("Updated", mockTeacher.getFirstname());
        verify(teacherRepository).save(mockTeacher);
    }

    @Test
    void testDeleteTeacher() {
        when(teacherRepository.findById(1)).thenReturn(Optional.of(mockTeacher));
        teacherService.deleteTeacher(1);
        verify(teacherRepository).delete(mockTeacher);
    }

    @Test
    void testDeleteTeacherNotFound() {
        when(teacherRepository.findById(1)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> teacherService.deleteTeacher(1));
    }

    @Test
    void testGetTeacherById() {
        when(teacherRepository.findById(1)).thenReturn(Optional.of(mockTeacher));
        when(teacherMapper.toTeacherDto(mockTeacher)).thenReturn(new TeacherDto());

        TeacherDto dto = teacherService.getTeacherById(1);
        assertNotNull(dto);
    }

    @Test
    void testGetAllTeachers() {
        when(teacherRepository.findAll()).thenReturn(List.of(mockTeacher));
        when(teacherMapper.toTeacherDtoList(anyList())).thenReturn(List.of(new TeacherDto()));

        List<TeacherDto> teachers = teacherService.getAllTeachers();
        assertEquals(1, teachers.size());
    }



    @Test
    void testSaveFile() throws IOException {
        MockMultipartFile file = new MockMultipartFile(
                "file", "image.jpg", "image/jpeg", "dummy content".getBytes());

        Path uploadPath = Paths.get("uploads/teachers");
        Files.createDirectories(uploadPath); // ensure path exists

        teacherService.saveFile(authentication, file);

        verify(teacherRepository).save(mockTeacher);
    }

    @Test
    void testGetProfileImage_FileExists() throws IOException {
        String fileName = "sample.jpg";
        Path uploadPath = Paths.get("uploads/teachers");
        Files.createDirectories(uploadPath);
        Path filePath = uploadPath.resolve(fileName);
        Files.write(filePath, "sample content".getBytes());

        mockTeacher.setProfileImagePath(fileName);
        when(teacherRepository.findById(1)).thenReturn(Optional.of(mockTeacher));

        ResponseEntity<Resource> response = teacherService.getProfileImage(authentication);
        assertEquals(200, response.getStatusCode().value());

        Files.deleteIfExists(filePath); // clean up
    }

    @Test
    void testGetProfileImageId_FileNotFound() {
        when(teacherRepository.findById(1)).thenReturn(Optional.of(mockTeacher));
        mockTeacher.setProfileImagePath("nonexistent.jpg");

        assertThrows(FileNotFoundException.class, () -> teacherService.getProfileImageId(1));
    }

    @Test
    void testGetCreatedCourses() {
        Course course = new Course();
        mockTeacher.setCreatedCourses(List.of(course));
        when(teacherRepository.findById(1)).thenReturn(Optional.of(mockTeacher));
        when(courseMapper.toCourseSummaryDtoList(anyList())).thenReturn(List.of(new CourseSummaryDto()));

        List<CourseSummaryDto> result = teacherService.getCreatedCourses(authentication);
        assertEquals(1, result.size());
    }
}
