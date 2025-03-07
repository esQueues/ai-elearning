package kz.sayat.diploma_backend.course_module.dto;

import kz.sayat.diploma_backend.auth_module.dto.TeacherDto;
import kz.sayat.diploma_backend.auth_module.models.Teacher;
import lombok.Data;

import java.util.List;

@Data
public class CourseDto {
    private int id;
    private String title;
    private String description;
    private List<ModuleDto> modules;
    private TeacherDto teacher;
    private boolean isEnrolled;
    private boolean isCreator;
    private boolean isPublic;
}
