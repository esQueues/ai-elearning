package kz.sayat.diploma_backend.course_module.controller;

import kz.sayat.diploma_backend.auth_module.dto.StudentDto;
import kz.sayat.diploma_backend.course_module.dto.CourseDto;
import kz.sayat.diploma_backend.course_module.dto.CourseSummaryDto;
import kz.sayat.diploma_backend.course_module.models.enums.CourseCategory;
import kz.sayat.diploma_backend.course_module.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @PostMapping()
    public ResponseEntity<CourseDto> courseCreation(@RequestBody CourseDto dto, Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED).body(courseService.createCourse(dto, authentication));
    }


    @GetMapping("/{id}")
    public ResponseEntity<CourseDto> getCourseById(@PathVariable int id,  Authentication auth) {
        return ResponseEntity.ok(courseService.findCourseById(id, auth));
    }

    @GetMapping("/certificate")
    public ResponseEntity<byte[]> generateCertificate(@RequestParam("courseId") int courseId, Authentication authentication) {
        ByteArrayOutputStream pdfStream = courseService.generateCertificate(courseId, authentication);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "certificate.pdf");
        return new ResponseEntity<>(pdfStream.toByteArray(), headers, HttpStatus.OK);
    }

    @PostMapping("/{courseId}/enroll")
    public ResponseEntity<String> enrollCourse(@PathVariable("courseId") int courseId,
                                               Authentication authentication) {
        courseService.enrollCourse(courseId,authentication);
        return ResponseEntity.ok("Student enrolled to course!");
    }

    @GetMapping("/my-courses")
    public ResponseEntity<List<CourseSummaryDto>> getCoursesOfStudent(Authentication authentication) {
        return ResponseEntity.ok(courseService.getMyCourses(authentication));
    }

    @GetMapping("/my-courses/completed")
    public ResponseEntity<List<CourseSummaryDto>> getCompletedCourses(Authentication authentication) {
        return ResponseEntity.ok(courseService.getCompletedCourses(authentication));
    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteCourse(@PathVariable(name = "id") int id) {
        courseService.deleteCourse(id);
    }


    @GetMapping("/{id}/students")
    public ResponseEntity<List<StudentDto>> enrolledStudents(@PathVariable(name = "id") int id) {
        return ResponseEntity.ok(courseService.getStudentForCourse(id));
    }


    @GetMapping("/get")
    public ResponseEntity<List<CourseSummaryDto>> getCourses(@RequestParam(required = false, defaultValue = "") String query) {
        List<CourseSummaryDto> courses = courseService.getCoursesByQuery(query);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/search/categories")
    public ResponseEntity<List<CourseSummaryDto>> getCoursesByCategories(
            @RequestParam(required = true) List<String> categories) {
        List<CourseSummaryDto> courses = courseService.getCoursesByCategory(categories);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        List<String> categories = Arrays.stream(CourseCategory.values())
                .map(CourseCategory::getLabel)
                .collect(Collectors.toList());
        return ResponseEntity.ok(categories);
    }



    @PatchMapping ("/{id}/approve")
    public void approveCourse(@PathVariable(name = "id") int id) {
        courseService.approve(id);
    }

    @PatchMapping("/{id}/disallow")
    public void disallowCourse(@PathVariable(name = "id") int id) {
        courseService.disallow(id);
    }

    @GetMapping("/all")
    public ResponseEntity<List<CourseSummaryDto>> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    @PutMapping("/{id}")
    public void editCourse(@PathVariable(name = "id") int id, @RequestBody CourseDto dto) {
        courseService.editCourse(dto, id);
    }

    @PostMapping("/upload-image")
    public void uploadImage(int id,@RequestParam("file") MultipartFile file) throws IOException {
        courseService.saveFile(id, file);
    }


    @GetMapping("/profile/image/{id}")
    public ResponseEntity<Resource> getProfileImage(@PathVariable int id) throws IOException {
        return courseService.getProfileImageId(id);
    }
}
