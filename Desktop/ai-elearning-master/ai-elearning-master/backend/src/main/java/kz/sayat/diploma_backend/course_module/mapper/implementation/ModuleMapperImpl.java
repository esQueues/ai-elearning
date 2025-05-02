package kz.sayat.diploma_backend.course_module.mapper.implementation;

import kz.sayat.diploma_backend.course_module.mapper.CourseMapper;
import kz.sayat.diploma_backend.course_module.mapper.LectureMapper;
import kz.sayat.diploma_backend.course_module.mapper.ModuleMapper;
import kz.sayat.diploma_backend.course_module.models.Module;
import kz.sayat.diploma_backend.course_module.dto.ModuleDto;
import kz.sayat.diploma_backend.quiz_module.mapper.QuizMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ModuleMapperImpl implements ModuleMapper {

    private final LectureMapper lectureMapper;
    private final QuizMapper quizMapper;

    @Override
    public Module toModule(ModuleDto dto) {
        if (dto == null) {
            return null;
        }

        Module module = new Module();
        module.setTitle(dto.getTitle());

        return module;
    }

    @Override
    public ModuleDto toModuleDto(Module module) {
        if (module == null) {
            return null;
        }

        ModuleDto dto = new ModuleDto();
        dto.setId(module.getId());
        dto.setTitle(module.getTitle());
        dto.setCourseId(module.getCourse().getId());
        if(module.getQuizzes()!=null){
            dto.setQuizzes(quizMapper.toQuizSummaryDtoList(module.getQuizzes()));
        }
        if(module.getLectures()!=null){
            dto.setLectures(lectureMapper.toLectureDtoList(module.getLectures()));
        }
        return dto;
    }

    @Override
    public List<ModuleDto> toModuleDtoList(List<Module> modules) {
        return modules.stream().map(
            this::toModuleDto)
            .collect(Collectors.toList());
    }
}
