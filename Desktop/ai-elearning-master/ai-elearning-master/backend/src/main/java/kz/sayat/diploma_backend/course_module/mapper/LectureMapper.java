package kz.sayat.diploma_backend.course_module.mapper;

import kz.sayat.diploma_backend.course_module.dto.LectureDto;
import kz.sayat.diploma_backend.course_module.models.Lecture;

import java.util.List;

public interface LectureMapper {
    Lecture toLecture(LectureDto lectureDto);
    LectureDto toLectureDto(Lecture lecture);
    List<LectureDto> toLectureDtoList(List<Lecture> lectureList);
}
