package kz.sayat.diploma_backend.auth_module.service.implementation;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import kz.sayat.diploma_backend.auth_module.dto.UserDto;
import kz.sayat.diploma_backend.auth_module.mapper.implementation.UserMapper;
import kz.sayat.diploma_backend.auth_module.models.User;
import kz.sayat.diploma_backend.auth_module.security.MyUserDetails;
import kz.sayat.diploma_backend.auth_module.service.AuthService;
import kz.sayat.diploma_backend.util.exceptions.AuthException;

import kz.sayat.diploma_backend.auth_module.mapper.StudentMapper;
import kz.sayat.diploma_backend.auth_module.mapper.TeacherMapper;
import kz.sayat.diploma_backend.auth_module.models.Student;
import kz.sayat.diploma_backend.auth_module.models.Teacher;
import kz.sayat.diploma_backend.auth_module.security.dto.LoginRequest;
import kz.sayat.diploma_backend.auth_module.security.dto.RegisterRequest;
import kz.sayat.diploma_backend.auth_module.repository.UserRepository;
import kz.sayat.diploma_backend.util.exceptions.UnauthorizedException;
import lombok.AllArgsConstructor;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextHolderStrategy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;


@Service
@AllArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final TeacherServiceImpl teacherService;
    private final TeacherMapper teacherMapper;
    private final AuthenticationManager authenticationManager;
    private final SecurityContextRepository securityContextRepository = new HttpSessionSecurityContextRepository();
    private final SecurityContextHolderStrategy securityContextHolderStrategy = SecurityContextHolder.getContextHolderStrategy();
    private final StudentMapper studentMapper;
    private final StudentServiceImpl studentService;
    private final UserRepository  userRepository;
    private final UserMapper userMapper;


    @Override
    public UserDto login(HttpServletRequest request, HttpServletResponse response, LoginRequest authRequest) {
        UsernamePasswordAuthenticationToken token = UsernamePasswordAuthenticationToken.unauthenticated(
            authRequest.email(), authRequest.password()
        );
        authenticate(token, request, response);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails userDetails) {
            if (userDetails instanceof MyUserDetails customUserDetails) {
                User user = customUserDetails.getUser();
                System.out.println(authRequest.email() + " signed in with role: " + user.getRole());
                return userMapper.toUserDto(user);
            }
        }
        throw new AuthException("Failed to retrieve user details");
    }


    @Override
    public void register(RegisterRequest request){

        if(isEmailExist(request.email())){
            throw new AuthException("Email already exists");
        }

        Student student= studentMapper.toStudent(request);
        studentService.save(student);

        System.out.println(request.email()+"  registered");
    }


    @Override
    public void registerTeacher(RegisterRequest request){
        if(isEmailExist(request.email())){
            throw new AuthException("Email already exists");
        }
        Teacher teacher = teacherMapper.toTeacher(request);

        teacherService.save(teacher);
        System.out.println(request.email()+"  register (teacher)");
    }

    @Override
    public Map<String, String> giveRole(Authentication authentication) {
        if(!authentication.isAuthenticated()){
            throw new UnauthorizedException("User is not authenticated");
        }
        MyUserDetails userDetails = (MyUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();
        Map<String, String> response = new HashMap<>();
        response.put("role", user.getRole().toString());
        return response;
    }

    private void authenticate(UsernamePasswordAuthenticationToken token, HttpServletRequest request, HttpServletResponse response) {
        Authentication authentication = this.authenticationManager.authenticate(token);
        SecurityContext context = this.securityContextHolderStrategy.createEmptyContext();
        context.setAuthentication(authentication);
        this.securityContextHolderStrategy.setContext(context);
        this.securityContextRepository.saveContext(context,request,response);
    }

    private boolean isEmailExist(String email) {
        return userRepository.existsByEmail(email);
    }

}
