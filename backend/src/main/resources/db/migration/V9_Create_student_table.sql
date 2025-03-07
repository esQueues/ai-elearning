CREATE TABLE students
(
    id INT PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
    birth_date DATE,
    grade_level varchar(100),
    school_info TEXT
);

