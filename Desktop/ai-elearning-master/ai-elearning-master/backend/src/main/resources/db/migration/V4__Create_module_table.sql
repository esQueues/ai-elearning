CREATE TABLE modules
(
    id        integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title     varchar(255),
    course_id integer NOT NULL REFERENCES courses(id) ON DELETE CASCADE
);