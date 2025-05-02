CREATE TABLE attempts (
                          id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
                          student_id INT REFERENCES students(id) ON DELETE CASCADE,
                          quiz_id INT REFERENCES quizzes(id) ON DELETE CASCADE,
                          attempt_number INT,
                          score DOUBLE PRECISION,  -- Привели в соответствие с DDL
                          submission_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          passed BOOLEAN DEFAULT FALSE
);
