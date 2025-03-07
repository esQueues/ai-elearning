CREATE TABLE answers(
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY ,
    answer_text TEXT NOT NULL ,
    is_correct BOOLEAN DEFAULT FALSE,
    question_id INT REFERENCES questions(id)
)