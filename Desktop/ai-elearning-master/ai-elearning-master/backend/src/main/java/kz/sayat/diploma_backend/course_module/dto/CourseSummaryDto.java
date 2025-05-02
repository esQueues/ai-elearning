package kz.sayat.diploma_backend.course_module.dto;

import kz.sayat.diploma_backend.auth_module.dto.TeacherDto;
import kz.sayat.diploma_backend.auth_module.models.Teacher;
import lombok.Data;

@Data
public class CourseSummaryDto {
    private int id;
    private String title;
    private TeacherDto teacher;
    private boolean isPublic;
    private double progress;
}
