package kz.sayat.diploma_backend.auth_module.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import kz.sayat.diploma_backend.course_module.models.Course;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "teachers")
@Data
@AllArgsConstructor
@NoArgsConstructor
@PrimaryKeyJoinColumn(name = "id")
public class Teacher extends User {

    private String bio;

    @JsonIgnore
    @OneToMany(mappedBy = "teacher", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    private List<Course> createdCourses;

}
