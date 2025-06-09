package kz.sayat.diploma_backend.course_module;

import kz.sayat.diploma_backend.auth_module.models.Student;
import kz.sayat.diploma_backend.auth_module.models.User;
import kz.sayat.diploma_backend.auth_module.models.enums.UserRole;
import kz.sayat.diploma_backend.auth_module.security.MyUserDetails;
import kz.sayat.diploma_backend.course_module.dto.LectureDto;
import kz.sayat.diploma_backend.course_module.models.Lecture;
import kz.sayat.diploma_backend.course_module.models.LectureView;
import kz.sayat.diploma_backend.course_module.models.Module;
import kz.sayat.diploma_backend.course_module.repository.LectureRepository;
import kz.sayat.diploma_backend.course_module.repository.LectureViewRepository;
import kz.sayat.diploma_backend.course_module.repository.ModuleRepository;
import kz.sayat.diploma_backend.course_module.mapper.LectureMapper;
import kz.sayat.diploma_backend.course_module.service.LectureService;
import kz.sayat.diploma_backend.course_module.service.implementations.LectureServiceImpl;
import kz.sayat.diploma_backend.util.exceptions.ResourceNotFoundException;
import kz.sayat.diploma_backend.util.exceptions.UnauthorizedException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LectureServiceTest {

    @Mock
    private LectureRepository lectureRepository;
    @Mock
    private ModuleRepository moduleRepository;
    @Mock
    private LectureMapper mapper;
    @Mock
    private LectureViewRepository lectureViewRepository;
    @Mock
    private Authentication authentication;

    @InjectMocks
    private LectureServiceImpl lectureService;

    private Lecture lecture;
    private LectureDto lectureDto;
    private Module module;
    private Student student;
    private MyUserDetails userDetails;

    @BeforeEach
    void setUp() {
        lecture = new Lecture();
        lecture.setId(1);
        lecture.setTitle("Test Lecture");
        lecture.setUrl("http://example.com");

        lectureDto = new LectureDto();
        lectureDto.setId(1);
        lectureDto.setTitle("Test Lecture");
        lectureDto.setUrl("http://example.com");

        module = new Module();
        module.setId(1);

        student = new Student();
        student.setId(1);
        student.setEmail("student@example.com");
        student.setRole(UserRole.STUDENT);

        userDetails = new MyUserDetails(student);
    }

    @Test
    void createLecture_Success() {
        when(moduleRepository.findById(1)).thenReturn(Optional.of(module));
        when(mapper.toLecture(lectureDto)).thenReturn(lecture);
        when(lectureRepository.save(lecture)).thenReturn(lecture);
        when(mapper.toLectureDto(lecture)).thenReturn(lectureDto);

        LectureDto result = lectureService.createLecture(lectureDto, 1);

        assertNotNull(result);
        assertEquals(lectureDto.getTitle(), result.getTitle());
        verify(lectureRepository).save(lecture);
    }

    @Test
    void createLecture_ModuleNotFound_ThrowsException() {
        when(moduleRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class, () -> lectureService.createLecture(lectureDto, 1));
        verifyNoInteractions(mapper, lectureRepository);
    }

    @Test
    void findLectureById_Success() {
        when(lectureRepository.findById(1)).thenReturn(Optional.of(lecture));
        when(mapper.toLectureDto(lecture)).thenReturn(lectureDto);

        LectureDto result = lectureService.findLectureById(1);

        assertNotNull(result);
        assertEquals(lectureDto.getTitle(), result.getTitle());
        verify(lectureRepository).findById(1);
    }

    @Test
    void findLectureById_NotFound_ReturnsNull() {
        when(lectureRepository.findById(1)).thenReturn(Optional.empty());

        LectureDto result = lectureService.findLectureById(1);

        assertNull(result);
        verify(lectureRepository).findById(1);
    }

    @Test
    void findLectureById_WithAuth_Success() {
        when(lectureRepository.findById(1)).thenReturn(Optional.of(lecture));
        when(mapper.toLectureDto(lecture)).thenReturn(lectureDto);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(lectureViewRepository.existsByStudentIdAndLectureId(1, 1)).thenReturn(true);

        LectureDto result = lectureService.findLectureById(1, authentication);

        assertNotNull(result);
        assertTrue(result.isViewed());
        verify(lectureRepository).findById(1);
        verify(lectureViewRepository).existsByStudentIdAndLectureId(1, 1);
    }

    @Test
    void findLectureById_WithAuth_LectureNotFound_ThrowsException() {
        when(lectureRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> lectureService.findLectureById(1, authentication));
        verify(lectureRepository).findById(1);
    }

    @Test
    void findAllLecturesByModuleId_Success() {
        when(lectureRepository.findByModule_Id(1)).thenReturn(Collections.singletonList(lecture));
        when(mapper.toLectureDtoList(Collections.singletonList(lecture))).thenReturn(Collections.singletonList(lectureDto));

        List<LectureDto> result = lectureService.findAllLecturesByModuleId(1);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(lectureRepository).findByModule_Id(1);
    }

    @Test
    void findAllLecturesByModuleId_NoLectures() {
        when(lectureRepository.findByModule_Id(1)).thenReturn(Collections.emptyList());
        when(mapper.toLectureDtoList(Collections.emptyList())).thenReturn(Collections.emptyList());

        List<LectureDto> result = lectureService.findAllLecturesByModuleId(1);

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(lectureRepository).findByModule_Id(1);
    }

    @Test
    void deleteLecture_Success() {
        lectureService.deleteLecture(1);

        verify(lectureRepository).deleteById(1);
    }

    @Test
    void editLecture_Success() {
        when(lectureRepository.findById(1)).thenReturn(Optional.of(lecture));
        when(mapper.toLectureDto(lecture)).thenReturn(lectureDto);

        LectureDto result = lectureService.editLecture(1, lectureDto);

        assertNotNull(result);
        assertEquals(lectureDto.getTitle(), result.getTitle());
        verify(lectureRepository).findById(1);
    }

    @Test
    void editLecture_NotFound_ThrowsException() {
        when(lectureRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> lectureService.editLecture(1, lectureDto));
        verify(lectureRepository).findById(1);
    }

    @Test
    void markLectureAsViewed_Success() {
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(lectureRepository.findById(1)).thenReturn(Optional.of(lecture));
        when(lectureViewRepository.existsByStudentIdAndLectureId(1, 1)).thenReturn(false);

        lectureService.markLectureAsViewed(authentication, 1);

        verify(lectureViewRepository).save(any(LectureView.class));
    }

    @Test
    void markLectureAsViewed_NotAuthenticated_ThrowsException() {
        when(authentication.isAuthenticated()).thenReturn(false);

        assertThrows(UnauthorizedException.class, () -> lectureService.markLectureAsViewed(authentication, 1));
        verifyNoInteractions(lectureRepository, lectureViewRepository);
    }

    @Test
    void markLectureAsViewed_LectureNotFound_ThrowsException() {
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(lectureRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> lectureService.markLectureAsViewed(authentication, 1));
        verify(lectureRepository).findById(1);
    }

    @Test
    void markLectureAsViewed_AlreadyViewed_NoAction() {
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(lectureRepository.findById(1)).thenReturn(Optional.of(lecture));
        when(lectureViewRepository.existsByStudentIdAndLectureId(1, 1)).thenReturn(true);

        lectureService.markLectureAsViewed(authentication, 1);

        verify(lectureViewRepository, never()).save(any(LectureView.class));
    }
}