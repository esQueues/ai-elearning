package kz.sayat.diploma_backend.course_module.controller;

import kz.sayat.diploma_backend.course_module.dto.LectureDto;
import kz.sayat.diploma_backend.course_module.dto.ModuleDto;
import kz.sayat.diploma_backend.course_module.models.Module;
import kz.sayat.diploma_backend.course_module.service.LectureService;
import kz.sayat.diploma_backend.course_module.service.ModuleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class ModuleController {

    private final ModuleService moduleService;
    private final LectureService lectureService;

    @PostMapping("/{courseId}/modules")
    public ResponseEntity<ModuleDto> createModule(@RequestBody ModuleDto dto,
                                  @PathVariable(name = "courseId")int courseId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(moduleService.createModule(dto, courseId));
    }

    @GetMapping("/modules/{moduleId}")
    public ResponseEntity<ModuleDto> getModule(@PathVariable("moduleId") int id) {
        return ResponseEntity.ok().body(moduleService.findModuleById(id));
    }

    @GetMapping("/modules/{moduleId}/lectures")
    public ResponseEntity<List<LectureDto>> getAllLectures(@PathVariable("moduleId") int moduleId) {
        return ResponseEntity.ok().body(lectureService.findAllLecturesByModuleId(moduleId));
    }

    @PutMapping("/modules/{moduleId}")
    @ResponseStatus(HttpStatus.OK)
    public void updateModule(@PathVariable(name = "moduleId") int id, @RequestBody ModuleDto dto){
        moduleService.edit(id, dto);
    }

    @DeleteMapping("/modules/{moduleId}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteModule(@PathVariable("moduleId") int moduleId) {
        moduleService.delete(moduleId);
    }

}
