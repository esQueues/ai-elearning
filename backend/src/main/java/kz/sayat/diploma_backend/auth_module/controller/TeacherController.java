package kz.sayat.diploma_backend.auth_module.controller;

import kz.sayat.diploma_backend.auth_module.dto.PasswordDto;
import kz.sayat.diploma_backend.auth_module.dto.TeacherDto;
import kz.sayat.diploma_backend.auth_module.service.TeacherService;
import kz.sayat.diploma_backend.course_module.dto.CourseSummaryDto;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;


@RestController
@RequestMapping("/api/teachers")
@RequiredArgsConstructor
public class TeacherController {

    private final TeacherService teacherService;

    @GetMapping("/profile")
    public ResponseEntity<TeacherDto> getProfile(Authentication authentication) {
        return ResponseEntity.ok().body(teacherService.getProfile(authentication));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeacherDto> getTeacherById(@PathVariable int id) {
        return ResponseEntity.ok(teacherService.getTeacherById(id));
    }

    @PutMapping("/profile/update")
    @ResponseStatus(HttpStatus.OK)
    public void updateTeacher(Authentication authentication, @RequestBody TeacherDto teacherDto) {
        teacherService.updateTeacher(authentication, teacherDto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteTeacher(@PathVariable int id) {
        teacherService.deleteTeacher(id);
    }

    @GetMapping
    public ResponseEntity<List<TeacherDto>> getAllTeachers() {
        return ResponseEntity.ok(teacherService.getAllTeachers());
    }

    @GetMapping("/courses")
    public ResponseEntity<List<CourseSummaryDto>> createdCourses(Authentication authentication) {
        return ResponseEntity.ok().body(teacherService.getCreatedCourses(authentication));
    }

    @PutMapping("/profile/change-password")
    @ResponseStatus(HttpStatus.OK)
    public void changePassword(@RequestBody PasswordDto changePasswordDto,
                               Authentication authentication) {
        teacherService.changePassword(authentication, changePasswordDto);
    }


    @PostMapping("/profile/image")
    public void uploadImage(
            Authentication authentication,
            @RequestParam("file") MultipartFile file) throws IOException {
        teacherService.saveFile(authentication,file);
    }


    @GetMapping("/profile/image")
    public ResponseEntity<Resource> getProfileImage(Authentication authentication) throws IOException {
        return teacherService.getProfileImage(authentication);
    }


    @GetMapping("/profile/image/{id}")
    public ResponseEntity<Resource> getProfileImage(@PathVariable int id) throws IOException {
        return teacherService.getProfileImageId(id);
    }

}
