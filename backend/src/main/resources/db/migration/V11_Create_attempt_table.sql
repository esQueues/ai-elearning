CREATE TABLE attempts(
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY ,
    student_id INT REFERENCES students(id) ON DELETE CASCADE ,
    quiz_id INT REFERENCES quizzes(id) ON DELETE CASCADE ,
    attempt_number INT,
    score DECIMAL(5,2),
    submission_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    passed boolean DEFAULT FALSE
)