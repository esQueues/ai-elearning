CREATE TABLE attempt_answers
(
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY ,
    attempt_id  INT     NOT NULL REFERENCES attempts(id),
    question_id INT     NOT NULL REFERENCES questions(id),
    answer_id   INT     NOT NULL REFERENCES answers(id),
    is_correct  BOOLEAN NOT NULL
);
