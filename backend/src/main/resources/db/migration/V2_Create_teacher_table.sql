CREATE TABLE teachers(
    id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE ,
    bio varchar(500)
)