package kz.sayat.diploma_backend.auth_module;

import kz.sayat.diploma_backend.auth_module.dto.UserDto;
import kz.sayat.diploma_backend.auth_module.models.Student;
import kz.sayat.diploma_backend.auth_module.models.Teacher;
import kz.sayat.diploma_backend.auth_module.models.User;
import kz.sayat.diploma_backend.auth_module.models.enums.UserRole;
import kz.sayat.diploma_backend.auth_module.security.MyUserDetails;
import kz.sayat.diploma_backend.auth_module.security.dto.LoginRequest;
import kz.sayat.diploma_backend.auth_module.security.dto.RegisterRequest;
import kz.sayat.diploma_backend.auth_module.service.AuthService;
import kz.sayat.diploma_backend.auth_module.service.implementation.AuthServiceImpl;
import kz.sayat.diploma_backend.auth_module.service.implementation.StudentServiceImpl;
import kz.sayat.diploma_backend.auth_module.service.implementation.TeacherServiceImpl;
import kz.sayat.diploma_backend.auth_module.mapper.implementation.UserMapper;
import kz.sayat.diploma_backend.auth_module.mapper.StudentMapper;
import kz.sayat.diploma_backend.auth_module.mapper.TeacherMapper;
import kz.sayat.diploma_backend.auth_module.repository.UserRepository;
import kz.sayat.diploma_backend.util.exceptions.AuthException;
import kz.sayat.diploma_backend.util.exceptions.UnauthorizedException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextHolderStrategy;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private TeacherServiceImpl teacherService;
    @Mock
    private TeacherMapper teacherMapper;
    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private SecurityContextRepository securityContextRepository;
    @Mock
    private SecurityContextHolderStrategy securityContextHolderStrategy;
    @Mock
    private StudentMapper studentMapper;
    @Mock
    private StudentServiceImpl studentService;
    @Mock
    private UserRepository userRepository;
    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private AuthServiceImpl authService;

    private MockHttpServletRequest request;
    private MockHttpServletResponse response;
    private LoginRequest loginRequest;
    private RegisterRequest registerRequest;
    private User user;
    private Student student;
    private Teacher teacher;
    private UserDto userDto;
    private Authentication authentication;
    private SecurityContext securityContext;

    @BeforeEach
    void setUp() {
        request = new MockHttpServletRequest();
        response = new MockHttpServletResponse();
        loginRequest = new LoginRequest("test@example.com", "password");
        registerRequest = new RegisterRequest(
                "test@example.com",
                "password123",
                "Test",
                "User",
                "Bio info",
                "Grade 10",
                "School XYZ",
                LocalDate.of(2000, 1, 1)
        );

        user = new Student();
        user.setId(1);
        user.setEmail("test@example.com");
        user.setRole(UserRole.STUDENT);

        student = new Student();
        student.setId(1);
        student.setEmail("test@example.com");
        student.setRole(UserRole.STUDENT);

        teacher = new Teacher();
        teacher.setId(1);
        teacher.setEmail("test@example.com");
        teacher.setRole(UserRole.TEACHER);

        userDto = new UserDto();
        userDto.setId(1);
        userDto.setEmail("test@example.com");
        userDto.setUserRole(UserRole.STUDENT);

        authentication = mock(Authentication.class);
        securityContext = mock(SecurityContext.class);

        // Set the mocked strategy for SecurityContextHolder
        SecurityContextHolder.setContextHolderStrategy(securityContextHolderStrategy);
    }

//    @Test
//    void login_Success() {
//        UsernamePasswordAuthenticationToken token = UsernamePasswordAuthenticationToken.unauthenticated("test@example.com", "password");
//        when(authenticationManager.authenticate(token)).thenReturn(authentication);
//        when(securityContextHolderStrategy.createEmptyContext()).thenReturn(securityContext);
//        when(securityContext.getAuthentication()).thenReturn(authentication);
//        when(authentication.getPrincipal()).thenReturn(new MyUserDetails(user));
//        when(userMapper.toUserDto(user)).thenReturn(userDto);
//
//        UserDto result = authService.login(request, response, loginRequest);
//
//        assertNotNull(result, "The result should not be null");
//        assertEquals(userDto.getEmail(), result.getEmail(), "The email should match");
//        verify(authenticationManager).authenticate(token);
//        verify(securityContextHolderStrategy).createEmptyContext();
//        verify(securityContext).setAuthentication(authentication);
//        verify(securityContextRepository).saveContext(securityContext, request, response);
//        verify(userMapper).toUserDto(user);
//    }

    @Test
    void login_FailedAuthentication_ThrowsException() {
        UsernamePasswordAuthenticationToken token = UsernamePasswordAuthenticationToken.unauthenticated("test@example.com", "wrongpassword");
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenThrow(new RuntimeException("Invalid credentials"));

        assertThrows(RuntimeException.class, () -> authService.login(request, response, loginRequest));
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verifyNoInteractions(securityContextHolderStrategy, securityContextRepository, userMapper);
    }

    @Test
    void register_Success() {
        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(studentMapper.toStudent(registerRequest)).thenReturn(student);
        doNothing().when(studentService).save(student);

        authService.register(registerRequest);

        verify(userRepository).existsByEmail("test@example.com");
        verify(studentMapper).toStudent(registerRequest);
        verify(studentService).save(student);
    }

    @Test
    void register_EmailExists_ThrowsException() {
        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

        assertThrows(AuthException.class, () -> authService.register(registerRequest));
        verify(userRepository).existsByEmail("test@example.com");
        verifyNoInteractions(studentMapper, studentService);
    }

    @Test
    void registerTeacher_Success() {
        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(teacherMapper.toTeacher(registerRequest)).thenReturn(teacher);
        doNothing().when(teacherService).save(teacher);

        authService.registerTeacher(registerRequest);

        verify(userRepository).existsByEmail("test@example.com");
        verify(teacherMapper).toTeacher(registerRequest);
        verify(teacherService).save(teacher);
    }

    @Test
    void registerTeacher_EmailExists_ThrowsException() {
        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

        assertThrows(AuthException.class, () -> authService.registerTeacher(registerRequest));
        verify(userRepository).existsByEmail("test@example.com");
        verifyNoInteractions(teacherMapper, teacherService);
    }

    @Test
    void giveRole_Success() {
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(new MyUserDetails(user));
        Map<String, String> expected = new HashMap<>();
        expected.put("role", UserRole.STUDENT.toString());

        Map<String, String> result = authService.giveRole(authentication);

        assertNotNull(result, "The result should not be null");
        assertEquals(expected, result, "The role should match");
        verify(authentication).isAuthenticated();
        verify(authentication).getPrincipal();
    }

    @Test
    void giveRole_NotAuthenticated_ThrowsException() {
        when(authentication.isAuthenticated()).thenReturn(false);

        assertThrows(UnauthorizedException.class, () -> authService.giveRole(authentication));
        verify(authentication).isAuthenticated();
        verifyNoMoreInteractions(authentication);
    }
}