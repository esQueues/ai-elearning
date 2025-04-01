CREATE TABLE quizzes
(
    id            integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title         varchar(255),
    module_id     integer NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    passing_score integer DEFAULT 50 NOT NULL
);