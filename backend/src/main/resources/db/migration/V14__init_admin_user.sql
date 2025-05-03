INSERT INTO users (email, password, role, firstname, lastname, created_at)
VALUES (
           'admin@gmail.com',
           '$2a$10$g1tNkIv0jgfJGPFOmvf6sO8HEOBsM3BBIhGhU34uhmsLh95zPOI5e',
           'ADMIN',
           'Admin',
           'Adminov',
           NOW()
       );
