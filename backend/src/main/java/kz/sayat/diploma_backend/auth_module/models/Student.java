package kz.sayat.diploma_backend.auth_module.models;

import jakarta.persistence.*;
import kz.sayat.diploma_backend.course_module.models.Enrollment;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "students")
@Data
@AllArgsConstructor
@NoArgsConstructor
@PrimaryKeyJoinColumn(name = "id")
public class Student extends User{

    private LocalDate birthDate;

    private String gradeLevel;

    private String schoolInfo;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Enrollment> enrollments;

}
