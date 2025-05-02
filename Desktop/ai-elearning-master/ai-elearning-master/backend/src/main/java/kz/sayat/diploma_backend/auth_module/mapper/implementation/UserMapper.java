package kz.sayat.diploma_backend.auth_module.mapper.implementation;

import kz.sayat.diploma_backend.auth_module.dto.UserDto;
import kz.sayat.diploma_backend.auth_module.models.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    public UserDto toUserDto(User user) {
        if(user == null) {
            return null;
        }
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setEmail(user.getEmail());
        userDto.setFirstName(user.getFirstname());
        userDto.setLastName(user.getLastname());
        userDto.setUserRole(user.getRole());

        return userDto;
    }
}
