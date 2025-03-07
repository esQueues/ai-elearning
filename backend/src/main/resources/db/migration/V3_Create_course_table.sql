CREATE TABLE courses(
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY ,
    title varchar(300) NOT NULL ,
    description TEXT,
    teacher_id INT REFERENCES teachers(id) ON DELETE SET NULL
)