CREATE TABLE enrollments
(
    student_id integer NOT NULL REFERENCES students(id),
    course_id  integer NOT NULL REFERENCES courses(id),
    completed  boolean DEFAULT false,
    PRIMARY KEY (student_id, course_id)
);