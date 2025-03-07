CREATE TABLE feedbacks(
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY ,
    prompt_text TEXT NOT NULL ,
    feedback_text TEXT NOT NULL ,
    attempt_id INT REFERENCES attempts(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);