package kz.sayat.diploma_backend.course_module;

import kz.sayat.diploma_backend.course_module.dto.LectureDto;
import kz.sayat.diploma_backend.course_module.dto.ModuleDto;
import kz.sayat.diploma_backend.course_module.dto.QuizSummaryDto;
import kz.sayat.diploma_backend.course_module.mapper.ModuleMapper;
import kz.sayat.diploma_backend.course_module.models.Course;
import kz.sayat.diploma_backend.course_module.models.Module;
import kz.sayat.diploma_backend.course_module.repository.CourseRepository;
import kz.sayat.diploma_backend.course_module.repository.ModuleRepository;
import kz.sayat.diploma_backend.course_module.service.ModuleService;
import kz.sayat.diploma_backend.course_module.service.implementations.ModuleServiceImpl;
import kz.sayat.diploma_backend.course_module.service.implementations.LectureServiceImpl;
import kz.sayat.diploma_backend.quiz_module.service.implementation.QuizServiceImpl;
import kz.sayat.diploma_backend.util.exceptions.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ModuleServiceTest {

    @Mock
    private ModuleRepository moduleRepository;
    @Mock
    private ModuleMapper mapper;
    @Mock
    private CourseRepository courseRepository;
    @Mock
    private QuizServiceImpl quizService;
    @Mock
    private LectureServiceImpl lectureService;
    @Mock
    private ModuleMapper moduleMapper;

    @InjectMocks
    private ModuleServiceImpl moduleService;

    private Module module;
    private ModuleDto moduleDto;
    private Course course;

    @BeforeEach
    void setUp() {
        module = new Module();
        module.setId(1);
        module.setTitle("Test Module");

        moduleDto = new ModuleDto();
        moduleDto.setId(1);
        moduleDto.setTitle("Test Module");
        moduleDto.setCourseId(1);

        course = new Course();
        course.setId(1);
    }

//    @Test
//    void createModule_Success() {
//        when(courseRepository.findById(1)).thenReturn(Optional.of(course));
//
//        when(mapper.toModule(moduleDto)).thenReturn(module);
//        Module savedModule = mock(Module.class);
//        when(savedModule.getId()).thenReturn(1);
//        when(savedModule.getCourse()).thenReturn(course);
//        when(moduleRepository.save(module)).thenReturn(savedModule);
//
//        when(moduleMapper.toModuleDto(savedModule)).thenReturn(moduleDto);
//
//        ModuleDto result = moduleService.createModule(moduleDto, 1);
//
//        assertNotNull(result, "The result should not be null");
//        assertEquals(moduleDto.getTitle(), result.getTitle(), "The title should match the input DTO");
//        verify(courseRepository).findById(1);
//        verify(mapper).toModule(moduleDto);
//        verify(moduleRepository).save(module);
//        verify(moduleMapper).toModuleDto(savedModule);
//    }

    @Test
    void createModule_CourseNotFound_ThrowsException() {
        when(courseRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class, () -> moduleService.createModule(moduleDto, 1));
        verifyNoInteractions(mapper, moduleRepository);
    }

    @Test
    void findModuleById_Success() {
        when(moduleRepository.findById(1)).thenReturn(Optional.of(module));
        when(quizService.findAllQuizByModuleId(1)).thenReturn(Collections.singletonList(new QuizSummaryDto()));
        when(lectureService.findAllLecturesByModuleId(1)).thenReturn(Collections.singletonList(new LectureDto()));
        when(mapper.toModuleDto(module)).thenReturn(moduleDto);

        ModuleDto result = moduleService.findModuleById(1);

        assertNotNull(result);
        assertEquals(moduleDto.getTitle(), result.getTitle());
        assertNotNull(result.getQuizzes());
        assertNotNull(result.getLectures());
        verify(moduleRepository).findById(1);
    }

    @Test
    void findModuleById_NotFound_ThrowsException() {
        when(moduleRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class, () -> moduleService.findModuleById(1));
        verify(moduleRepository).findById(1);
    }

    @Test
    void delete_Success() {
        when(moduleRepository.existsById(1)).thenReturn(true);

        moduleService.delete(1);

        verify(moduleRepository).deleteById(1);
    }

    @Test
    void delete_NotFound_ThrowsException() {
        when(moduleRepository.existsById(1)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> moduleService.delete(1));
        verify(moduleRepository, never()).deleteById(anyInt());
    }

    @Test
    void edit_Success() {
        when(moduleRepository.findById(1)).thenReturn(Optional.of(module));

        moduleService.edit(1, moduleDto);

        assertEquals(moduleDto.getTitle(), module.getTitle());
        verify(moduleRepository).save(module);
    }

    @Test
    void edit_NotFound_ThrowsException() {
        when(moduleRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> moduleService.edit(1, moduleDto));
        verify(moduleRepository, never()).save(any());
    }
}