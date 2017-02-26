DROP DATABASE IF EXISTS newspoint;
CREATE DATABASE newspoint;

\c newspoint;

CREATE TABLE news (
  ID SERIAL PRIMARY KEY,
  words VARCHAR
);

INSERT INTO news (words)
  VALUES ('json news string');