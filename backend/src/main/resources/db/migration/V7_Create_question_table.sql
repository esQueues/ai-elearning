CREATE TABLE questions(
    id int PRIMARY KEY GENERATED ALWAYS AS IDENTITY ,
    question_text TEXT NOT NULL ,
    quiz_id int REFERENCES quizzes(id)
)