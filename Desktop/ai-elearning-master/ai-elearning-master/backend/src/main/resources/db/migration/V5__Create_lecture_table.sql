CREATE TABLE lectures
(
    id        integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title     varchar(255) NOT NULL,
    url       varchar(2048),
    module_id integer NOT NULL REFERENCES modules(id) ON DELETE CASCADE
);