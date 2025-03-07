CREATE TABLE lectures(
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY ,
    title varchar(300) NOT NULL ,
    url VARCHAR(2048) ,
    module_id INT NOT NULL ,
    FOREIGN KEY (module_id) REFERENCES modules(id)
)