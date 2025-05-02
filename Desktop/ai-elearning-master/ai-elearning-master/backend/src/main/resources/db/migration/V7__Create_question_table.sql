CREATE TABLE questions
(
    id            integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    question_text varchar(255) NOT NULL,
    quiz_id       integer REFERENCES quizzes(id) ON DELETE CASCADE
);