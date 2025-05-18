package kz.sayat.diploma_backend.auth_module.service.implementation;

import jakarta.transaction.Transactional;
import kz.sayat.diploma_backend.auth_module.dto.PasswordDto;
import kz.sayat.diploma_backend.auth_module.dto.TeacherDto;
import kz.sayat.diploma_backend.auth_module.service.TeacherService;
import kz.sayat.diploma_backend.course_module.dto.CourseSummaryDto;
import kz.sayat.diploma_backend.course_module.mapper.CourseMapper;
import kz.sayat.diploma_backend.course_module.models.Course;
import kz.sayat.diploma_backend.util.exceptions.ResourceNotFoundException;
import kz.sayat.diploma_backend.util.exceptions.UnauthorizedException;
import kz.sayat.diploma_backend.auth_module.mapper.TeacherMapper;
import kz.sayat.diploma_backend.auth_module.models.Teacher;
import kz.sayat.diploma_backend.auth_module.models.User;
import kz.sayat.diploma_backend.auth_module.repository.TeacherRepository;
import kz.sayat.diploma_backend.auth_module.security.MyUserDetails;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class TeacherServiceImpl implements TeacherService {

    private final TeacherRepository teacherRepository;
    private final TeacherMapper teacherMapper;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
    private final CourseMapper courseMapper;

    @Override
    public void save(Teacher teacher){
        teacher.setPassword(encoder.encode(teacher.getPassword()));
        teacherRepository.save(teacher);
    }

    @Override
    public TeacherDto getProfile(Authentication authentication) {
        return  teacherMapper.toTeacherDto(getTeacherFromUser(authentication));
    }

    @Override
    public void updateTeacher(Authentication authentication, TeacherDto teacherDto) {
        Teacher teacher = getTeacherFromUser(authentication);

        teacher.setFirstname(teacherDto.getFirstname());
        teacher.setLastname(teacherDto.getLastname());
        teacher.setBio(teacherDto.getBio());
        teacherRepository.save(teacher);

    }

    @PreAuthorize("hasRole('ADMIN')")
    @Override
    public void deleteTeacher(int id) {
        Teacher teacher = teacherRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        teacherRepository.delete(teacher);
    }

    @Override
    public TeacherDto getTeacherById(int id) {
        Teacher teacher=teacherRepository.findById(id).
            orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));
        return teacherMapper.toTeacherDto(teacher);
    }

    @Override
    public List<TeacherDto> getAllTeachers() {
        List<Teacher> teachers = teacherRepository.findAll();
        return teacherMapper.toTeacherDtoList(teachers);
    }

    @Override
    public Teacher getTeacherFromUser(Authentication authentication){
        if(!authentication.isAuthenticated()){
            throw new UnauthorizedException("User is not authenticated");
        }
        MyUserDetails userDetails = (MyUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();
        if (!(user instanceof Teacher teacher)) {
            throw new RuntimeException("User is not a student");
        }
        return teacher;
    }

    @Override
    public List<CourseSummaryDto> getCreatedCourses(Authentication authentication) {
        Teacher teacher=getTeacherFromUser(authentication);
        teacher = teacherRepository.findById(teacher.getId()).orElseThrow(() ->
            new ResourceNotFoundException("Teacher not found"));
        List<Course> createdCourses= teacher.getCreatedCourses();
        return courseMapper.toCourseSummaryDtoList(createdCourses);
    }

    @Override
    public void changePassword(Authentication authentication, PasswordDto changePasswordDto) {
        Teacher teacher = getTeacherFromUser(authentication);
        if(!encoder.matches(changePasswordDto.getOldPassword(), teacher.getPassword())){
            throw new ResourceNotFoundException("Password does not match");
        }
        teacher.setPassword(encoder.encode(changePasswordDto.getNewPassword()));
        teacherRepository.save(teacher);
    }


    @Override
    public void saveFile(Authentication authentication, MultipartFile file) throws IOException {
        Path uploadPath = Paths.get("uploads", "teachers");

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(filename);

        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        Teacher teacher = getTeacherFromUser(authentication);
        teacher.setProfileImagePath(filename);
        teacherRepository.save(teacher);

        System.out.println("Файл сохранён: " + filePath.toAbsolutePath());
    }


    @Override
    public ResponseEntity<Resource> getProfileImage(Authentication authentication) throws IOException {
        Teacher teacher = getTeacherFromUser(authentication);

        if (teacher.getProfileImagePath() == null) {
            throw new FileNotFoundException("У преподавателя нет изображения");
        }

        Path path = Paths.get("uploads/teachers").resolve(teacher.getProfileImagePath());
        Resource resource = new UrlResource(path.toUri());

        if (!resource.exists()) {
            throw new FileNotFoundException("Файл не найден: " + path.toString());
        }


        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(Files.probeContentType(path)))
                .body(resource);
    }

    @Override
    public ResponseEntity<Resource> getProfileImageId(int id) throws IOException {
        Teacher teacher = teacherRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Teacher not found"));

        if (teacher.getProfileImagePath() == null) {
            throw new FileNotFoundException("У преподавателя нет изображения");
        }

        Path path = Paths.get("uploads/teachers").resolve(teacher.getProfileImagePath());
        Resource resource = new UrlResource(path.toUri());

        if (!resource.exists()) {
            throw new FileNotFoundException("Файл не найден: " + path.toString());
        }


        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(Files.probeContentType(path)))
                .body(resource);
    }


}
