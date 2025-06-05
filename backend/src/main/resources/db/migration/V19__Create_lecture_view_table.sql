CREATE TABLE lecture_views
(
    id         INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    student_id    INT    NOT NULL,
    lecture_id INT    NOT NULL,
    viewed_at  TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_lecture_view_user
        FOREIGN KEY (student_id)
            REFERENCES students (id)
            ON DELETE CASCADE,

    CONSTRAINT fk_lecture_view_lecture
        FOREIGN KEY (lecture_id)
            REFERENCES lectures (id)
            ON DELETE CASCADE,

    CONSTRAINT uc_user_lecture UNIQUE (student_id, lecture_id)
);

