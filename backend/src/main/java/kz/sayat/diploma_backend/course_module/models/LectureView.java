package kz.sayat.diploma_backend.course_module.models;

import jakarta.persistence.*;
import kz.sayat.diploma_backend.auth_module.models.Student;
import kz.sayat.diploma_backend.auth_module.models.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "lecture_views")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LectureView {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Student student;

    @ManyToOne
    private Lecture lecture;

    private LocalDateTime viewedAt;
}
