package kz.sayat.diploma_backend.course_module.service.implementations;

import jakarta.transaction.Transactional;
import kz.sayat.diploma_backend.auth_module.models.Student;
import kz.sayat.diploma_backend.auth_module.models.User;
import kz.sayat.diploma_backend.auth_module.models.enums.UserRole;
import kz.sayat.diploma_backend.auth_module.security.MyUserDetails;
import kz.sayat.diploma_backend.course_module.dto.LectureDto;
import kz.sayat.diploma_backend.course_module.mapper.LectureMapper;
import kz.sayat.diploma_backend.course_module.models.Lecture;
import kz.sayat.diploma_backend.course_module.models.LectureView;
import kz.sayat.diploma_backend.course_module.models.Module;
import kz.sayat.diploma_backend.course_module.repository.LectureRepository;
import kz.sayat.diploma_backend.course_module.repository.LectureViewRepository;
import kz.sayat.diploma_backend.course_module.repository.ModuleRepository;
import kz.sayat.diploma_backend.course_module.service.LectureService;
import kz.sayat.diploma_backend.util.exceptions.ResourceNotFoundException;
import kz.sayat.diploma_backend.util.exceptions.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@Transactional
@RequiredArgsConstructor
public class LectureServiceImpl implements LectureService {

    private final LectureRepository lectureRepository;
    private final ModuleRepository moduleRepository;
    private final LectureMapper mapper;
    private final LectureViewRepository lectureViewRepository;

    @Override
    @PreAuthorize("hasRole('TEACHER')")
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
    public LectureDto findLectureById(int id, Authentication auth) {
        Lecture lecture = lectureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lecture not found with id: " + id));

        LectureDto lectureDto = mapper.toLectureDto(lecture);

        if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof MyUserDetails userDetails
                && userDetails.getUser().getRole() == UserRole.STUDENT) {
            Student student = (Student) userDetails.getUser();
            boolean viewed = lectureViewRepository.existsByStudentIdAndLectureId(student.getId(), id);
            lectureDto.setViewed(viewed);
        } else {
            lectureDto.setViewed(false);
        }

        return lectureDto;
    }


    @Override
    public List<LectureDto> findAllLecturesByModuleId(int moduleId) {
        List<Lecture> lectures = lectureRepository.findByModule_Id(moduleId);
        return mapper.toLectureDtoList(lectures);
    }

    @Override
    @PreAuthorize("hasRole('TEACHER')")
    public void deleteLecture(int id) {
        lectureRepository.deleteById(id);
    }

    @Override
    @PreAuthorize("hasRole('TEACHER')")
    public LectureDto editLecture(int id, LectureDto dto) {
        Lecture lecture=lectureRepository.findById(id).orElseThrow
            (()-> new ResourceNotFoundException("lecture not found"));

        lecture.setTitle(dto.getTitle());
        lecture.setUrl(dto.getUrl());

        return mapper.toLectureDto(lecture);
    }

    public void markLectureAsViewed(Authentication auth, int lectureId) {
        Student student = getStudentFromUser(auth);

        Lecture lecture = lectureRepository.findById(lectureId)
                .orElseThrow(() -> new RuntimeException("Lecture not found with id: " + lectureId));

        if (!lectureViewRepository.existsByStudentIdAndLectureId(student.getId(), lectureId)) {
            LectureView lectureView = new LectureView();
            lectureView.setStudent(student);
            lectureView.setLecture(lecture);
            lectureView.setViewedAt(LocalDateTime.now());

            lectureViewRepository.save(lectureView);
        }
    }


    private Student getStudentFromUser(Authentication authentication){
        if(!authentication.isAuthenticated()){
            throw new UnauthorizedException("User is not authenticated");
        }
        MyUserDetails userDetails = (MyUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();
        if (!(user instanceof Student student)) {
            throw new RuntimeException("User is not a student");
        }
        return student;
    }

}
