package kz.sayat.diploma_backend.course_module.mapper.implementation;
import kz.sayat.diploma_backend.auth_module.mapper.TeacherMapper;
import kz.sayat.diploma_backend.auth_module.mapper.implementation.TeacherMapperHelper;
import kz.sayat.diploma_backend.course_module.dto.CourseDto;
import kz.sayat.diploma_backend.course_module.dto.CourseSummaryDto;
import kz.sayat.diploma_backend.course_module.mapper.CourseMapper;
import kz.sayat.diploma_backend.course_module.mapper.ModuleMapper;
import kz.sayat.diploma_backend.course_module.models.Course;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class CourseMapperImpl implements CourseMapper {


    private final ModuleMapper moduleMapper;
    private final TeacherMapperHelper teacherMapper;


    @Override
    public Course toCourse(CourseDto courseDto) {
        if (courseDto == null) {
            return null;
        }

        Course course = new Course();
        course.setId(courseDto.getId());
        course.setTitle(courseDto.getTitle());
        course.setDescription(courseDto.getDescription());

        return course;
    }

    @Override
    public CourseDto toCourseDto(Course course) {
        if (course == null) {
            return null;
        }

        CourseDto courseDto = new CourseDto();
        courseDto.setId(course.getId());
        courseDto.setTitle(course.getTitle());
        courseDto.setDescription(course.getDescription());
        if(course.getModules() != null) {
            courseDto.setModules(moduleMapper.toModuleDtoList(course.getModules()));
        }
        if(course.getTeacher() != null) {
            courseDto.setTeacher(teacherMapper.toTeacherDtoWithoutCourses(course.getTeacher()));
        }
        courseDto.setPublic(course.isPublic());

        return courseDto;
    }

    @Override
    public List<CourseDto> toCourseDtoList(List<Course> courseList) {
        return courseList.stream().map(
                this ::toCourseDto)
            .collect(Collectors.toList());
    }

    @Override
    public CourseSummaryDto toCourseSummaryDto(Course course) {
        if(course == null) {
            return null;
        }
        CourseSummaryDto courseSummaryDto = new CourseSummaryDto();
        courseSummaryDto.setId(course.getId());
        courseSummaryDto.setTitle(course.getTitle());
        courseSummaryDto.setTeacher(teacherMapper.toTeacherDtoWithoutCourses(course.getTeacher()));
        courseSummaryDto.setPublic(course.isPublic());

        return courseSummaryDto;
    }

    @Override
    public List<CourseSummaryDto> toCourseSummaryDtoList(List<Course> courseList) {
        return courseList.stream().map(
            this::toCourseSummaryDto
        ).collect(Collectors.toList());
    }

}