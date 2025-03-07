package kz.sayat.diploma_backend.auth_module.mapper.implementation;

import kz.sayat.diploma_backend.auth_module.dto.TeacherDto;
import kz.sayat.diploma_backend.auth_module.models.Teacher;
import org.springframework.stereotype.Component;

@Component
public class TeacherMapperHelper {

    public TeacherDto toTeacherDtoWithoutCourses(Teacher teacher) {
        if (teacher == null) return null;

        TeacherDto teacherDto = new TeacherDto();
        teacherDto.setId(teacher.getId());
        teacherDto.setEmail(teacher.getEmail());
        teacherDto.setFirstname(teacher.getFirstname());
        teacherDto.setLastname(teacher.getLastname());
        teacherDto.setBio(teacher.getBio());

        return teacherDto;
    }
}

