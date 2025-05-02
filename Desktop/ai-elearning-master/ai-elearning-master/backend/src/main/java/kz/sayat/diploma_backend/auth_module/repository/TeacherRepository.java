package kz.sayat.diploma_backend.auth_module.repository;

import kz.sayat.diploma_backend.auth_module.models.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Integer> {

}
