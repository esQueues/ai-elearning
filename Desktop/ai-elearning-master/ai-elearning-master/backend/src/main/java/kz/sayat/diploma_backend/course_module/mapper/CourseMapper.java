package kz.sayat.diploma_backend.course_module.mapper;

import kz.sayat.diploma_backend.course_module.dto.CourseDto;
import kz.sayat.diploma_backend.course_module.dto.CourseSummaryDto;
import kz.sayat.diploma_backend.course_module.mapper.implementation.CourseMapperImpl;
import kz.sayat.diploma_backend.course_module.models.Course;

import java.util.List;

public interface CourseMapper {
    Course toCourse(CourseDto courseDto);
    CourseDto toCourseDto(Course course);
    List<CourseDto> toCourseDtoList(List<Course> courseList);

    CourseSummaryDto toCourseSummaryDto(Course course);
    List<CourseSummaryDto> toCourseSummaryDtoList(List<Course> courseList);
}
