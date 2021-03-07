DROP DATABASE IF EXISTS frelanserd CASCADE;
CREATE DATABASE IF NOT EXISTS frelanserd;
SET DATABASE = frelanserd;

CREATE TABLE IF NOT EXISTS users (
 id SERIAL PRIMARY KEY,
 email VARCHAR NOT NULL UNIQUE,
 username VARCHAR NOT NULL UNIQUE,
 followers_count INT NOT NULL DEFAULT 0 CHECK (followers_count >= 0),
 followees_count INT NOT NULL DEFAULT 0 CHECK (followers_count >= 0)
 );
  CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    user_id SERIAL REFERENCES users,
    content VARCHAR NOT NULL,
    spoiler_of VARCHAR,
    nsfw BOOLEAN NOT NULL DEFAULT false,
    likes_count INT NOT NULL DEFAULT 0 CHECK (likes_count >= 0),
    comments_count INT NOT NULL DEFAULT 0 CHECK (comments_count >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
 );
 
 CREATE TABLE IF NOT EXISTS  follows (
     follwer_id INT NOT NULL REFERENCES users,
     follwee_id INT NOT NULL REFERENCES users,
     PRIMARY KEY (follwer_id, follwee_id)
 );
  CREATE TABLE IF NOT EXISTS  comments (
     id SERIAL NOT NULL PRIMARY KEY,
     value VARCHAR NOT NULL,
     title VARCHAR NOT NULL,
     pid SERIAL NOT NULL REFERENCES posts,
     uid SERIAL NOT NULL REFERENCES users,
     username VARCHAR,
     created_at TIMESTAMP NOT NULL DEFAULT now()

);
CREATE TABLE IF NOT EXISTS post_likes(
    user_id  SERIAL NOT NULL REFERENCES users,
    post_id SERIAL NOT NULL REFERENCES posts,
    PRIMARY KEY (user_id, post_id)

);
CREATE INDEX IF NOT EXISTS sported_posts ON posts (created_at DESC);
 CREATE TABLE IF NOT EXISTS timeline (
      id SERIAL PRIMARY KEY,
       user_id  SERIAL NOT NULL REFERENCES users,
    post_id SERIAL NOT NULL REFERENCES posts
 );
 CREATE UNIQUE INDEX IF NOT EXISTS timeline_unique ON timeline (user_id, post_id);




 SELECT posts.id, content, spoiler_of, nsfw, likes_count,created_at, images.name
	
	, posts.user_id = 589787864940871681 AS mine
	, likes.user_id IS NOT NULL AS liked
	
	FROM posts 
	
	 LEFT JOIN post_likes AS likes
	  ON likes.user_id = 589787864940871681 AND likes.post_id = posts.id
	
	 LEFT JOIN images ON images.post_id = posts.id AND posts.id = images.post_id 
	WHERE posts.user_id = ( SELECT id FROM users WHERE username = 'alex'
	AND posts.id <  59351833032536883300000)
	ORDER BY created_at DESC
    LIMIT 3;
