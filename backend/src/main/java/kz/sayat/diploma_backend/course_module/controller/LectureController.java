package kz.sayat.diploma_backend.course_module.controller;

import kz.sayat.diploma_backend.course_module.dto.LectureDto;
import kz.sayat.diploma_backend.course_module.models.Lecture;
import kz.sayat.diploma_backend.course_module.service.LectureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/courses/modules")
public class LectureController {

    private final LectureService lectureService;

    @PostMapping("/{moduleId}/lectures")
    public ResponseEntity<LectureDto> createLecture(@RequestBody LectureDto dto, @PathVariable int moduleId) {
        return new ResponseEntity<>(lectureService.createLecture(dto, moduleId), HttpStatus.CREATED);
    }

    @GetMapping("/lectures/{id}")
    public ResponseEntity<LectureDto> getLecture(@PathVariable("id") int id) {
        return ResponseEntity.ok().body(lectureService.findLectureById(id));
    }

    @ResponseStatus(HttpStatus.OK)
    @DeleteMapping("/lecture/{id}")
    public void deleteLecture(@PathVariable("id") int id) {
        lectureService.deleteLecture(id);
    }

    @PutMapping("/lectures/{id}")
    public ResponseEntity<LectureDto> editLecture(@PathVariable("id") int id, @RequestBody LectureDto dto) {
        return ResponseEntity.ok().body(lectureService.editLecture(id,dto));
    }
}
