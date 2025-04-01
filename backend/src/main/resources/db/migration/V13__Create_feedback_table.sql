CREATE TABLE feedbacks
(
    id            integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    prompt_text   text NOT NULL,
    feedback_text text NOT NULL,
    attempt_id    integer REFERENCES attempts(id) ON DELETE CASCADE,
    created_at    timestamp DEFAULT CURRENT_TIMESTAMP
);