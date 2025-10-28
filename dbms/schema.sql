-- Create the database (optional, if not yet created)
CREATE DATABASE IF NOT EXISTS taskmaster DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE taskmaster;

-- Create "subjects" table
CREATE TABLE IF NOT EXISTS subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Create "tasks" table
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject_id INT NOT NULL,
    content VARCHAR(255) NOT NULL,
    completed TINYINT(1) DEFAULT 0,
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
);

-- Insert sample subject
INSERT INTO subjects (name) VALUES ('Sample Subject');

-- Insert sample task
INSERT INTO tasks (subject_id, content, completed) VALUES (1, 'Sample Task', 0);