CREATE TABLE attempt_answers
(
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    attempt_id  INT NOT NULL REFERENCES attempts(id) ON DELETE CASCADE,
    question_id INT NOT NULL REFERENCES questions(id),
    answer_id   INT NOT NULL REFERENCES answers(id) ON DELETE CASCADE,
    is_correct  BOOLEAN NOT NULL
);
