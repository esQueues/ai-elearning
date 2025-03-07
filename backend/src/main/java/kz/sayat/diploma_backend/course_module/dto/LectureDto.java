package kz.sayat.diploma_backend.course_module.dto;

import lombok.Data;

@Data
public class LectureDto {
    private int id;
    private String title;
    private String url;
    private int courseId;
    private int moduleId;
}
