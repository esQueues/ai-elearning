package kz.sayat.diploma_backend.auth_module.mapper.implementation;


import kz.sayat.diploma_backend.auth_module.dto.TeacherDto;
import kz.sayat.diploma_backend.auth_module.mapper.TeacherMapper;
import kz.sayat.diploma_backend.auth_module.models.Teacher;
import kz.sayat.diploma_backend.auth_module.models.enums.UserRole;
import kz.sayat.diploma_backend.auth_module.security.dto.RegisterRequest;
import kz.sayat.diploma_backend.course_module.mapper.CourseMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class TeacherMapperImpl implements TeacherMapper {

    private final CourseMapper courseMapper;

    @Override
    public Teacher toTeacher(TeacherDto teacherDto) {
        if (teacherDto == null) {
            return null;
        }

        Teacher teacher = new Teacher();
        teacher.setId(teacherDto.getId());
        teacher.setEmail(teacherDto.getEmail());
        teacher.setFirstname(teacherDto.getFirstname());
        teacher.setLastname(teacherDto.getLastname());
        teacher.setBio(teacherDto.getBio());

        return teacher;
    }


    @Override
    public TeacherDto toTeacherDto(Teacher teacher) {
        if (teacher == null) {
            return null;
        }

        TeacherDto teacherDto = new TeacherDto();
        teacherDto.setId(teacher.getId());
        teacherDto.setEmail(teacher.getEmail());
        teacherDto.setFirstname(teacher.getFirstname());
        teacherDto.setLastname(teacher.getLastname());
        teacherDto.setBio(teacher.getBio());
        teacherDto.setCreatedCourses(courseMapper.toCourseSummaryDtoList(teacher.getCreatedCourses()));

        return teacherDto;
    }

    @Override
    public Teacher toTeacher(RegisterRequest registerRequest) {
        if (registerRequest == null) {
            return null;
        }

        Teacher teacher = new Teacher();
        teacher.setEmail(registerRequest.email());
        teacher.setPassword(registerRequest.password());
        teacher.setRole(UserRole.TEACHER);
        teacher.setFirstname(registerRequest.firstname());
        teacher.setLastname(registerRequest.lastname());
        teacher.setBio(registerRequest.bio());

        return teacher;
    }

    @Override
    public List<TeacherDto> toTeacherDtoList(List<Teacher> teachers) {
        return teachers.stream().map(
            this::toTeacherDto
        ).collect(Collectors.toList());
    }

}