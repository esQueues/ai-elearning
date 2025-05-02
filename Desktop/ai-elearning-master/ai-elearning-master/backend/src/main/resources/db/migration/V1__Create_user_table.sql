CREATE TABLE users
(
    id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email      varchar(255) NOT NULL UNIQUE,
    password   varchar(255) NOT NULL,
    role       varchar(255),
    firstname  varchar(255) NOT NULL,
    lastname   varchar(255) NOT NULL,
    created_at timestamp
);