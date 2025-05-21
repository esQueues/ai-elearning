CREATE TABLE teachers
(
    id  bigint NOT NULL PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    bio text,
    profile_image_path VARCHAR(255)
);