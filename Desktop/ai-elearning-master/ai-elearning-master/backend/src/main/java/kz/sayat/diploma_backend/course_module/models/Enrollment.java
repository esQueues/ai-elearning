package kz.sayat.diploma_backend.course_module.models;

import jakarta.persistence.*;
import kz.sayat.diploma_backend.auth_module.models.Student;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "enrollments")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Enrollment {

    @EmbeddedId
    private EnrollmentId id;

    @ManyToOne
    @MapsId("student")
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @MapsId("course")
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    private boolean completed;
}
