package kz.sayat.diploma_backend.course_module.service;

import kz.sayat.diploma_backend.course_module.dto.LectureDto;
import kz.sayat.diploma_backend.course_module.models.Lecture;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface LectureService {

    LectureDto createLecture(LectureDto dto, int moduleId);

    LectureDto findLectureById(int id);

    List<LectureDto> findAllLecturesByModuleId(int moduleId);

    void deleteLecture(int id);

    LectureDto editLecture(int id, LectureDto dto);

    void markLectureAsViewed(Authentication auth, int lectureId);

    LectureDto findLectureById(int id, Authentication auth);
}
