CREATE TABLE modules(
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY ,
    title varchar(200),
    course_id INT NOT NULL,
    FOREIGN KEY (course_id) REFERENCES courses(id)
)