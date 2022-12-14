INSERT INTO department (name)
VALUES ('Engineering'),
       ('Finance'),
       ('Legal'),
       ('Sales');

INSERT INTO role (title, department_id, salary)
VALUES ('Sales Lead', 4, 100000),
       ('Software Engineer', 1, 120000),
       ('Accountant', 2, 125000);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', 3, null),
       ('Mike', 'Chan', 2, 1),
       ('Tom', 'Allen', 1, 1);

