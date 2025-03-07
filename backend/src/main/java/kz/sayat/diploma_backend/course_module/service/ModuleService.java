package kz.sayat.diploma_backend.course_module.service;

import kz.sayat.diploma_backend.course_module.dto.ModuleDto;
import kz.sayat.diploma_backend.course_module.models.Module;

public interface ModuleService {
    ModuleDto createModule(ModuleDto dto, int courseId);
    ModuleDto findModuleById(int id);

    void delete(int moduleId);

    void edit(int id, ModuleDto dto);
}
