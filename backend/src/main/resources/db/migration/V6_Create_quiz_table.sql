CREATE TABLE quizzes
(
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title varchar(300),
    module_id INT REFERENCES modules(id)
);
