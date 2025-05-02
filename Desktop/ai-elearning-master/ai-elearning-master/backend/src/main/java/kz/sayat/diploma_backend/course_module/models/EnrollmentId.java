package kz.sayat.diploma_backend.course_module.models;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Embeddable
public class EnrollmentId implements Serializable {
    private int student;
    private int course;
}
