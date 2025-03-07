package kz.sayat.diploma_backend.auth_module.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import kz.sayat.diploma_backend.course_module.dto.CourseSummaryDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentDto {

    private int id;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "First name is required")
    private String firstname;

    @NotBlank(message = "Last name is required")
    private String lastname;

    @NotNull(message = "Grade level is required")
    String gradeLevel;

    @NotBlank(message = "School info is required")
    String schoolInfo;

    LocalDate birthday;
    List<CourseSummaryDto> enrolledCourses;
}
