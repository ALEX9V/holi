DROP DATABASE IF EXISTS frelansers CASCADE;
CREATE DATABASE IF NOT EXISTS frelansers;
SET DATABASE = frelansers;

CREATE TABLE IF NOT EXISTS users (
 id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
 email VARCHAR NOT NULL UNIQUE,
 username VARCHAR NOT NULL UNIQUE,
 followers_count INT NOT NULL DEFAULT 0 CHECK (followers_count >= 0),
 followees_count INT NOT NULL DEFAULT 0 CHECK (followers_count >= 0)
 );
  CREATE TABLE IF NOT EXISTS posts (
    id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users,
    content VARCHAR NOT NULL,
    spoiler_of VARCHAR,
    nsfw BOOLEAN NOT NULL DEFAULT false,
    likes_count INT NOT NULL DEFAULT 0 CHECK (likes_count >= 0),
    comments_count INT NOT NULL DEFAULT 0 CHECK (comments_count >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
 );
 
 CREATE TABLE IF NOT EXISTS  follows (
     follwer_id UUID NOT NULL REFERENCES users,
     follwee_id UUID NOT NULL REFERENCES users,
     PRIMARY KEY (follwer_id, follwee_id)
 );
  CREATE TABLE IF NOT EXISTS  comments (
     id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
     value VARCHAR NOT NULL,
     title VARCHAR NOT NULL,
     pid UUID NOT NULL REFERENCES posts,
     uid UUID NOT NULL REFERENCES users,
     username VARCHAR,
     created_at TIMESTAMP NOT NULL DEFAULT now()

);
CREATE TABLE IF NOT EXISTS post_likes(
    user_id  UUID NOT NULL REFERENCES users,
    post_id UUID NOT NULL REFERENCES posts,
    PRIMARY KEY (user_id, post_id)

);
CREATE INDEX IF NOT EXISTS sported_posts ON posts (created_at DESC);
 CREATE TABLE IF NOT EXISTS timeline (
      id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
       user_id  UUID NOT NULL REFERENCES users,
    post_id UUID NOT NULL REFERENCES posts
 );
 CREATE UNIQUE INDEX IF NOT EXISTS timeline_unique ON timeline (user_id, post_id);
