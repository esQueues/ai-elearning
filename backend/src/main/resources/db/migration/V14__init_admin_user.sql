INSERT INTO users (email, password, role, firstname, lastname, created_at)
VALUES (
           'admin@gmail.com',
           '$2a$12$IiZS6y6bEPY96LYpM6XWqOpv.8NoQ.l33mBlYeWREFf8Q.lSWC/yC',
           'ADMIN',
           'Admin',
           'Adminov',
           NOW()
       );
