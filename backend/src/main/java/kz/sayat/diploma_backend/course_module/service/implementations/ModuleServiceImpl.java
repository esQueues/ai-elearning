package kz.sayat.diploma_backend.course_module.service.implementations;


import jakarta.transaction.Transactional;
import kz.sayat.diploma_backend.course_module.dto.LectureDto;
import kz.sayat.diploma_backend.course_module.dto.ModuleDto;
import kz.sayat.diploma_backend.course_module.dto.QuizSummaryDto;
import kz.sayat.diploma_backend.course_module.mapper.ModuleMapper;
import kz.sayat.diploma_backend.course_module.models.Course;
import kz.sayat.diploma_backend.course_module.models.Module;
import kz.sayat.diploma_backend.course_module.repository.CourseRepository;
import kz.sayat.diploma_backend.course_module.repository.LectureRepository;
import kz.sayat.diploma_backend.course_module.repository.ModuleRepository;
import kz.sayat.diploma_backend.course_module.service.ModuleService;
import kz.sayat.diploma_backend.quiz_module.repository.QuizRepository;
import kz.sayat.diploma_backend.quiz_module.service.implementation.QuizServiceImpl;
import kz.sayat.diploma_backend.util.exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@Transactional
@RequiredArgsConstructor
public class ModuleServiceImpl implements ModuleService {

    private final ModuleRepository moduleRepository;
    private final ModuleMapper mapper;
    private final CourseRepository courseRepository;
    private final QuizServiceImpl quizService;
    private final LectureServiceImpl lectureService;
    private final LectureRepository lectureRepository;
    private final QuizRepository quizRepository;
    private final ModuleMapper moduleMapper;

    @Override
    public ModuleDto createModule(ModuleDto dto, int courseId) {
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new NoSuchElementException("Course with ID " + dto.getCourseId() + " not found"));
        Module module = mapper.toModule(dto);
        module.setCourse(course);

        return moduleMapper.toModuleDto(moduleRepository.save(module));
    }

    @Override
    public ModuleDto findModuleById(int id) {
        Module module= moduleRepository.findById(id).orElseThrow(()
            -> new NoSuchElementException("Module with ID " + id + " not found"));

        List<QuizSummaryDto> quizzes = quizService.findAllQuizByModuleId(id);
        List<LectureDto> lectures = lectureService.findAllLecturesByModuleId(id);

        ModuleDto dto = mapper.toModuleDto(module);
        dto.setQuizzes(quizzes);
        dto.setLectures(lectures);
        return dto;
    }

    @Override
    public void delete(int moduleId) {
        if(!moduleRepository.existsById(moduleId)) {
            throw new ResourceNotFoundException("Module with ID " + moduleId + " not found");
        }
//        Module module= moduleRepository.findById(moduleId).orElseThrow(() -> new ResourceNotFoundException("Module with ID " + moduleId + " not found"));
//        lectureRepository.deleteByModuleId(moduleId);
//        quizRepository.deleteByModuleId(moduleId);
        moduleRepository.deleteById(moduleId);

    }

    @Override
    public void edit(int id, ModuleDto dto) {
        Module module= moduleRepository.findById(id).orElseThrow(() ->
            new ResourceNotFoundException("Module with ID " + id + " not found"));

        module.setTitle(dto.getTitle());

        moduleRepository.save(module);
    }
}
