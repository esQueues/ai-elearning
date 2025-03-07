package kz.sayat.diploma_backend.course_module.service.implementations;

import jakarta.transaction.Transactional;
import kz.sayat.diploma_backend.course_module.dto.LectureDto;
import kz.sayat.diploma_backend.course_module.mapper.LectureMapper;
import kz.sayat.diploma_backend.course_module.models.Lecture;
import kz.sayat.diploma_backend.course_module.models.Module;
import kz.sayat.diploma_backend.course_module.repository.LectureRepository;
import kz.sayat.diploma_backend.course_module.repository.ModuleRepository;
import kz.sayat.diploma_backend.course_module.service.LectureService;
import kz.sayat.diploma_backend.util.exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@Transactional
@RequiredArgsConstructor
public class LectureServiceImpl implements LectureService {

    private final LectureRepository lectureRepository;
    private final ModuleRepository moduleRepository;
    private final LectureMapper mapper;


    @Override
    public LectureDto createLecture(LectureDto dto, int moduleId) {
        Module module = moduleRepository.findById(moduleId).
            orElseThrow(NoSuchElementException::new);
        Lecture lecture = mapper.toLecture(dto);
        lecture.setModule(module);

        lectureRepository.save(lecture);
        return mapper.toLectureDto(lecture);
    }

    @Override
    public LectureDto findLectureById(int id) {
        return mapper.toLectureDto(lectureRepository.findById(id)
            .orElse(null));
    }


    @Override
    public List<LectureDto> findAllLecturesByModuleId(int moduleId) {

        List<Lecture> lectures = lectureRepository.findByModule_Id(moduleId);
        return mapper.toLectureDtoList(lectures);
    }

    @Override
    public void deleteLecture(int id) {
        lectureRepository.deleteById(id);
    }

    @Override
    public LectureDto editLecture(int id, LectureDto dto) {
        Lecture lecture=lectureRepository.findById(id).orElseThrow
            (()-> new ResourceNotFoundException("lecture not found"));

        lecture.setTitle(dto.getTitle());
        lecture.setUrl(dto.getUrl());

        return mapper.toLectureDto(lecture);
    }

}
