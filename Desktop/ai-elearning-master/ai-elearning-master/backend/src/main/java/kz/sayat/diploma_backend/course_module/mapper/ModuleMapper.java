package kz.sayat.diploma_backend.course_module.mapper;
import kz.sayat.diploma_backend.course_module.models.Module;
import kz.sayat.diploma_backend.course_module.dto.ModuleDto;

import java.util.List;

public interface ModuleMapper {
     Module toModule(ModuleDto dto);
     ModuleDto toModuleDto(Module module);
     List<ModuleDto> toModuleDtoList(List<Module> modules);
}
