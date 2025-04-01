CREATE TABLE students
(
    id          integer NOT NULL PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    birth_date  date,
    grade_level varchar(255),
    school_info text
);