DROP DATABASE IF EXISTS frelanserh CASCADE;
CREATE DATABASE IF NOT EXISTS frelanserh;
SET DATABASE = frelanserh;

CREATE TABLE IF NOT EXISTS users (
 id SERIAL PRIMARY KEY,
 email VARCHAR NOT NULL UNIQUE,
 username VARCHAR NOT NULL UNIQUE,
 about VARCHAR NOT NULL DEFAULT 'не указано',
 skils VARCHAR NOT NULL DEFAULT 'не указано',
 city VARCHAR(15) NOT NULL DEFAULT 'не указано',
  age   INT NOT NULL DEFAULT 0,
  checker INT NOT NULL DEFAULT 0,
  fnamer VARCHAR(25) NOT NULL,
  lnmrl VARCHAR(25) NOT NULL,
  opit INT NOT NULL DEFAULT 0,
  raty real NOT NULL DEFAULT 0,
  password  VARCHAR(50) NOT NULL,
 statys BOOLEAN NOT NULL DEFAULT true,
 dates TIMESTAMP NOT NULL DEFAULT now(),
 followers_count INT NOT NULL DEFAULT 0 CHECK (followers_count >= 0),
 followees_count INT NOT NULL DEFAULT 0 CHECK (followers_count >= 0)
 );

   CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    user_id SERIAL NOT NULL REFERENCES users,
    content VARCHAR NOT NULL,
    spoiler_of VARCHAR,
    nsfw BOOLEAN NOT NULL DEFAULT false,
    likes_count INT NOT NULL DEFAULT 0 CHECK (likes_count >= 0),
    comments_count INT NOT NULL DEFAULT 0 CHECK (comments_count >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    tag VARCHAR NOT NULL,
    usopit VARCHAR(8) NOT NULL,
    timeproj BOOLEAN  NOT NULL DEFAULT false,
    worktp BOOLEAN  NOT NULL DEFAULT false,
    hourtp BOOLEAN  NOT NULL DEFAULT false,
    amount INT NOT NULL DEFAULT 0,
    selecter BOOLEAN  NOT NULL DEFAULT false,
    deleted BOOLEAN  NOT NULL DEFAULT false,
    age INT NOT NULL,
    access INT NOT NULL, 
    type int not null DEFAULT 1,
    title VARCHAR(100)


 );
CREATE TABLE IF NOT EXISTS groups (
    id SERIAL NOT NULL  PRIMARY KEY,
    theme VARCHAR NOT NULL,
    opis VARCHAR NOT NULL,
    user_id SERIAL NOT NULL REFERENCES users,
    post_id BIGINT REFERENCES posts,
    closer  VARCHAR NOT NULL,
    passwordGpUs VARCHAR NOT NULL DEFAULT md5(random()::text),
    issued_at TIMESTAMPTZ NOT NULL DEFAULT now()
   

);

 CREATE TABLE IF NOT EXISTS  otzyv (
     id SERIAL NOT NULL PRIMARY KEY,
     uid SERIAL NOT NULL REFERENCES users,
     uid2 SERIAL NOT NULL REFERENCES users ,
     rating INT NOT NULL DEFAULT 0,
     value VARCHAR NOT NULL,
     created_at TIMESTAMP NOT NULL DEFAULT now(),
     CONSTRAINT order_unique UNIQUE (uid2)
);


 select column_name,data_type 
from information_schema.columns 
where table_name = 'notifications';
 CREATE TABLE IF NOT EXISTS  follows (
     follwer_id INT NOT NULL REFERENCES users,
     follwee_id INT NOT NULL REFERENCES users,
     PRIMARY KEY (follwer_id, follwee_id)
 );
  CREATE TABLE IF NOT EXISTS  comments (
     id SERIAL NOT NULL PRIMARY KEY,
     value VARCHAR NOT NULL,
     title VARCHAR NOT NULL,
     pid SERIAL ,
     uid SERIAL NOT NULL REFERENCES users,
     username VARCHAR,
     gid SERIAL,
     selecter BOOLEAN NOT NULL DEFAULT false,
     created_at TIMESTAMP NOT NULL DEFAULT now()

);
 CREATE TABLE IF NOT EXISTS  orders (
     id SERIAL NOT NULL PRIMARY KEY,
     pid SERIAL NOT NULL REFERENCES posts,
     uid SERIAL NOT NULL REFERENCES users,
     gid SERIAL NOT NULL REFERENCES groups,
     created_at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS post_likes(
    user_id  SERIAL NOT NULL REFERENCES users,
    post_id SERIAL NOT NULL REFERENCES posts,
    PRIMARY KEY (user_id, post_id)

);
CREATE TABLE IF NOT EXISTS user_rating(
    user_id  SERIAL NOT NULL REFERENCES users,
    user_id2 SERIAL NOT NULL REFERENCES users,
    PRIMARY KEY (user_id, user_id2)

);
CREATE TABLE IF NOT EXISTS avatar(
    id SERIAL PRIMARY KEY,
    user_id SERIAL NOT NULL REFERENCES users,
    name VARCHAR DEFAULT 'avatar.png'
    
);
CREATE TABLE IF NOT EXISTS vidjet(
    id SERIAL PRIMARY KEY,
    uid SERIAL NOT NULL REFERENCES users,
    gid SERIAL NOT NULL REFERENCES groups,
    link VARCHAR(400) NOT NULL,
    issuedAt TIMESTAMP NOT NULL DEFAULT now()
    
);
CREATE TABLE IF NOT EXISTS timelinemess(
    uid_in SERIAL NOT NULL REFERENCES users,
    uid_out SERIAL NOT NULL REFERENCES users,
PRIMARY KEY (uid_in, uid_out)
);
CREATE TABLE IF NOT EXISTS images(
    id SERIAL PRIMARY KEY,
    user_id SERIAL NOT NULL REFERENCES users,
    post_id SERIAL  UNIQUE REFERENCES posts,
    name VARCHAR DEFAULT 'avatar.png'
    
);
CREATE TABLE IF NOT EXISTS imagesgp(
    id SERIAL PRIMARY KEY,
    user_id SERIAL NOT NULL REFERENCES users,
    cid SERIAL NOT NULL REFERENCES comments,
    name VARCHAR DEFAULT 'avatar.png'
    
);
  CREATE TABLE IF NOT EXISTS  messanges_noty (
     id SERIAL NOT NULL PRIMARY KEY,
     value VARCHAR NOT NULL,
     messages VARCHAR NOT NULL,
     uid_In SERIAL NOT NULL REFERENCES users,
     actors1 VARCHAR[] NOT NULL,
     actors2 VARCHAR[] NOT NULL,
     uid_Out SERIAL NOT NULL REFERENCES users,
     created_at TIMESTAMP NOT NULL DEFAULT now()

);
  CREATE TABLE IF NOT EXISTS  messanges_gp (
     id SERIAL NOT NULL PRIMARY KEY,
     messages VARCHAR NOT NULL,
     uid_In SERIAL NOT NULL REFERENCES users,
     gid SERIAL NOT NULL REFERENCES groups,
     created_at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL NOT NULL,
    user_id SERIAL NOT NULL REFERENCES users,
    actors VARCHAR[] NOT NULL,
    type VARCHAR NOT NULL,
    post_id BIGINT REFERENCES posts,
    user_id2 BIGINT REFERENCES users,
    read_at TIMESTAMPTZ,
    issued_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS notificationz (
    id SERIAL NOT NULL,
    user_id SERIAL NOT NULL REFERENCES users,
    actors VARCHAR[] NOT NULL,
    type VARCHAR NOT NULL,
    post_id BIGINT REFERENCES posts,
    user_id2 BIGINT REFERENCES users,
    read_at TIMESTAMPTZ,
    issued_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messanges_notyfi (
    id SERIAL NOT NULL,
    value VARCHAR NOT NULL,
    messages VARCHAR NOT NULL,
    uid_in BIGINT REFERENCES users,
    uid_out BIGINT REFERENCES users,
    read_at VARCHAR(15),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS orderzz (
    id SERIAL NOT NULL,
    pid BIGINT REFERENCES posts,
    uid BIGINT REFERENCES users,
    uidm BIGINT REFERENCES users,
    gid BIGINT REFERENCES groups,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS tags (
    id SERIAL NOT NULL  PRIMARY KEY,
    tag VARCHAR NOT NULL,
    issued_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS tagss (
    id SERIAL NOT NULL  PRIMARY KEY,
    tag VARCHAR NOT NULL,
    UNIQUE(tag),
    pid BIGINT  NOT NULL,
    uid BIGINT REFERENCES users,
    issued_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE  tags_relation (
    tid SERIAL  NOT NULL,
    pid SERIAL  NOT NULL 
);

CREATE TABLE IF NOT EXISTS gpall (
    id SERIAL NOT NULL  PRIMARY KEY,
    value VARCHAR,
    type VARCHAR NOT NULL,
    uid SERIAL NOT NULL REFERENCES users,
    uid2 SERIAL REFERENCES users,
    pid SERIAL,
    gid SERIAL,
    issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    modcl varchar  not Null
);

CREATE TABLE  groupU (
     id SERIAL NOT NULL  PRIMARY KEY,
    uid SERIAL  NOT NULL REFERENCES users,
    gid SERIAL  NOT NULL 
);

CREATE TABLE IF NOT EXISTS notificationsMess (
    id SERIAL NOT NULL,
    user_id SERIAL NOT NULL REFERENCES users,
    actors VARCHAR[] NOT NULL,
    type VARCHAR NOT NULL,
    user_id2 SERIAL REFERENCES users,
    read_at TIMESTAMPTZ,
    issued_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS userGp(
    uid SERIAL NOT NULL REFERENCES users,
    gid SERIAL NOT NULL REFERENCES groups,
PRIMARY KEY (uid, gid)
);
CREATE INDEX IF NOT EXISTS sported_posts ON posts (created_at DESC);
 CREATE TABLE IF NOT EXISTS timeline (
      id SERIAL PRIMARY KEY,
       user_id  SERIAL NOT NULL REFERENCES users,
    post_id SERIAL NOT NULL
 );
 CREATE TABLE IF NOT EXISTS post_subscriptions (
    user_id SERIAL NOT NULL REFERENCES users,
    post_id SERIAL NOT NULL,
    PRIMARY KEY (user_id, post_id)
 );
 CREATE UNIQUE INDEX IF NOT EXISTS timeline_unique ON timeline (user_id, post_id);



/*INSERT INTO users (id, email, username) VALUES 
(1, 'JOHN', 'alex@ya.com'),
(2, 'Jina', 'jinna@ya.com');*/
CREATE UNIQUE INDEX unique_notifications ON notifications (user_id, type, post_id, read_at, user_id2  );
/*
INSERT INTO avatar (id, user_id, name) 
VALUES (1, 589787864940871681, '1500x500.jpeg');
ALTER TABLE notifications ALTER COLUMN post_id TYPE BIGINT;
*/
/*
INSERT INTO avatar ( "user_id", "name") VALUES ( 592939641249497089, 'avatar.png') ON CONFLICT (id) DO UPDATE SET name = 'avatar.png';

INSERT INTO avatar ( user_id, name) VALUES ( 592939641249497089, 'avatar.png') ON DUPLICATE KEY UPDATE user_id = 592939641249497089, name = 'avatar.png';

SELECT users.id, email, followers_count, followees_count,  followers.follwer_id IS NOT NULL AS following, followees.follwee_id IS NOT NULL AS followeed, avatar.name FROM users LEFT JOIN follows AS followers ON followers.follwer_id = 589787864940871681 AND followers.follwee_id = users.id LEFT JOIN follows AS followees ON followees.follwer_id = users.id AND followees.follwee_id = 589787864940871681 LEFT JOIN avatar ON avatar.user_id = avatar.user_id  AND avatar.user_id = 589787864940871681 WHERE username = 'alex';
SELECT users.id, email, followers_count, followees_count,  followers.follwer_id IS NOT NULL AS following, followees.follwee_id IS NOT NULL AS followeed FROM users LEFT JOIN follows AS followers ON followers.follwer_id = 589787864940871681 AND followers.follwee_id = users.id LEFT JOIN follows AS followees ON followees.follwer_id = users.id AND followees.follwee_id = 589787864940871681 LEFT JOIN avatar ON avatar.user_id = avatar.user_id  AND avatar.user_id = 589787864940871681 WHERE username = 'alex';
*/