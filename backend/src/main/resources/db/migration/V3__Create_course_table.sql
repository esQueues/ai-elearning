CREATE TABLE courses
(
    id          integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title       varchar(255) NOT NULL,
    description text,
    teacher_id  bigint REFERENCES teachers(id) ON DELETE SET NULL,
    is_public   boolean DEFAULT false
);