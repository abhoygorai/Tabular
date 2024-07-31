CREATE TABLE users (
    "user_id" SERIAL PRIMARY KEY,
    "username" VARCHAR(255),
    "password" VARCHAR(255) NOT NULL
);

GRANT ALL PRIVILEGES ON DATABASE user_data TO user_1;
GRANT INSERT ON TABLE users TO user_1;
GRANT USAGE, SELECT ON SEQUENCE users_user_id_seq TO user_1;

select * from users

GRANT SELECT ON TABLE users TO user_1;