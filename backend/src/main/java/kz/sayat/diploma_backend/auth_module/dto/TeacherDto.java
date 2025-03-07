package kz.sayat.diploma_backend.auth_module.dto;

import kz.sayat.diploma_backend.course_module.dto.CourseDto;
import kz.sayat.diploma_backend.course_module.dto.CourseSummaryDto;
import lombok.Data;

import java.util.List;

@Data
public class TeacherDto {
    private int id;
    private String email;
    private String firstname;
    private String lastname;
    private String bio;
    private List<CourseSummaryDto> createdCourses;
}
