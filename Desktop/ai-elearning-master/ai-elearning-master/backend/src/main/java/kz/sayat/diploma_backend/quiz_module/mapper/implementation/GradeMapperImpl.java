package kz.sayat.diploma_backend.quiz_module.mapper.implementation;

import kz.sayat.diploma_backend.quiz_module.dto.GradeDto;
import kz.sayat.diploma_backend.quiz_module.mapper.GradeMapper;
import kz.sayat.diploma_backend.quiz_module.models.QuizAttempt;
import org.springframework.stereotype.Component;

@Component
public class GradeMapperImpl implements GradeMapper {
    @Override
    public QuizAttempt toGrade(GradeDto dto) {
        if(dto == null) {
            return null;
        }

        QuizAttempt grade = new QuizAttempt();
        grade.setScore(dto.getScore());
//        grade.setAttemptNumber(dto.getAttemptNumber());
        return grade;
    }
}
