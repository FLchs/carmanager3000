-- SQL script for vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

INSERT INTO vehicles (name) VALUES ('New Vehicle Name');
INSERT INTO vehicles (name) VALUES ('New Vehicle Name');

