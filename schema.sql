CREATE DATABASE employeeTracker_db;

USE employeeTracker_db;

CREATE TABLE department (
  id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  name VARCHAR(255)
);

CREATE TABLE roles (
  role_id INT AUTO_INCREMENT PRIMARY KEY,
  job_title VARCHAR(255),
  dept_id INT,
  salary INT
);

CREATE TABLE employee_data (
  emp_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  role_id INT,
  FOREIGN KEY (role_id) REFERENCES roles(role_id),
  manager VARCHAR(255)
);