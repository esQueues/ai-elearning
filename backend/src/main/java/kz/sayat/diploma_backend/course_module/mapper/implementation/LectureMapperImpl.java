package kz.sayat.diploma_backend.course_module.mapper.implementation;

import kz.sayat.diploma_backend.course_module.dto.LectureDto;
import kz.sayat.diploma_backend.course_module.mapper.LectureMapper;
import kz.sayat.diploma_backend.course_module.models.Lecture;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class LectureMapperImpl implements LectureMapper {
    @Override
    public Lecture toLecture(LectureDto lectureDto) {
        if (lectureDto == null) {
            return null;
        }
        Lecture lecture = new Lecture();
        lecture.setTitle(lectureDto.getTitle());
        lecture.setUrl(lectureDto.getUrl());
        return lecture;
    }

    @Override
    public LectureDto toLectureDto(Lecture lecture) {
        if(lecture == null) {
            return null;
        }
        LectureDto lectureDto = new LectureDto();
        lectureDto.setId(lecture.getId());
        lectureDto.setTitle(lecture.getTitle());
        lectureDto.setUrl(lecture.getUrl());
        lectureDto.setCourseId(lecture.getModule().getCourse().getId());
        lectureDto.setModuleId(lecture.getModule().getId());
        return lectureDto;
    }

    @Override
    public List<LectureDto> toLectureDtoList(List<Lecture> lectureList) {
        return lectureList.stream()
            .map(this::toLectureDto)
            .collect(Collectors.toList());
    }
}
