package kz.sayat.diploma_backend.course_module.models.enums;

import lombok.Getter;

import java.util.List;

@Getter
public enum CourseCategory {
    Math("Math", List.of("Math","Algebra", "Geometry", "Calculus")),
    AI("Artificial Intelligence", List.of("Artificial Intelligence","AI", "ChatGPT", "ML", "Machine Learning", "Deep Learning")),
    Kazakh("Kazakh Language", List.of("Kazakh","Kazakh language", "Қазақ тілі")),
    Russian("Russian Language", List.of("Russian","Russian language", "Русский язык")),
    English("English Language", List.of("English","English language", "IELTS", "TOEFL")),
    IT("Information Technology", List.of("Information Technology","IT", "Programming", "Software")),
    Physics("Physics", List.of("Physics","Mechanics", "Electricity", "Quantum")),
    Chemistry("Chemistry", List.of("Organic", "Inorganic", "Chemistry", "Reactions")),
    Biology("Biology", List.of("Genetics", "Cells", "Organisms", "Biology")),
    Geography("Geography", List.of("Maps", "Climate", "Geography", "Continents")),
    History("History", List.of("History","Ancient", "Modern", "World Wars", "History"));

    private final String label;
    private final List<String> tags;

    CourseCategory(String label, List<String> tags) {
        this.label = label;
        this.tags = tags;
    }
}
