CREATE TABLE teachers
(
    id  bigint NOT NULL PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    bio varchar(255)
);