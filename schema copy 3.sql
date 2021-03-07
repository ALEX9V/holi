DROP DATABASE IF EXISTS frelanserh CASCADE;
CREATE DATABASE IF NOT EXISTS frelanserh;
SET DATABASE = frelanserh;

CREATE TABLE IF NOT EXISTS hv2_b7891567567 (
 pnv2_b78915325667 SERIAL PRIMARY KEY,
 pnv3_b78915325667 VARCHAR NOT NULL UNIQUE,
 pnv4_b78915325667 VARCHAR NOT NULL UNIQUE,
 about VARCHAR NOT NULL DEFAULT 'не указано',
 pnv5_b78915325667 VARCHAR NOT NULL DEFAULT 'не указано',
 pnv6_b78915325667 VARCHAR(15) NOT NULL DEFAULT 'не указано',
  pnv35_b78915325667   INT NOT NULL DEFAULT 0,
  pnv8_b78915325667r INT NOT NULL DEFAULT 0,
  pnv9_b78915325667 VARCHAR(25) NOT NULL,
  pnv10_b78915325667 VARCHAR(25) NOT NULL,
  pnv11_b78915325667 INT NOT NULL DEFAULT 0,
  pnv12_b78915325667 real NOT NULL DEFAULT 0,
  pnv13_b78915325667  VARCHAR(50) NOT NULL,
 pnv14_b78915325667 BOOLEAN NOT NULL DEFAULT true,
 pnv15_b78915325667 TIMESTAMP NOT NULL DEFAULT now(),
 pnv16_b78915325667 INT NOT NULL DEFAULT 0 CHECK (pnv16_b78915325667 >= 0),
 pnv18_b78915325667 INT NOT NULL DEFAULT 0 CHECK (pnv16_b78915325667 >= 0)
 );

   CREATE TABLE IF NOT EXISTS pnv19_b78915325667 (
    pnv2_b78915325667 SERIAL PRIMARY KEY,
    pnv20_b78915325667 SERIAL NOT NULL REFERENCES hv2_b7891567567,
    pnv21_b78915325667 VARCHAR NOT NULL,
    pnv22_b78915325667 VARCHAR,
    pnv23_b78915325667 BOOLEAN NOT NULL DEFAULT false,
    pnv24_b78915325667 INT NOT NULL DEFAULT 0 CHECK (pnv24_b78915325667 >= 0),
    pnv25_b78915325667 INT NOT NULL DEFAULT 0 CHECK (pnv25_b78915325667 >= 0),
    pnv26_b78915325667 TIMESTAMPTZ NOT NULL DEFAULT now(),
    pnv27_b78915325667 VARCHAR NOT NULL,
    pnv28_b78915325667 VARCHAR(8) NOT NULL,
    pnv29_b78915325667 BOOLEAN  NOT NULL DEFAULT false,
    pnv30_b78915325667 BOOLEAN  NOT NULL DEFAULT false,
    pnv31_b78915325667 BOOLEAN  NOT NULL DEFAULT false,
    pnv32_b78915325667 INT NOT NULL DEFAULT 0,
    pnv33_b78915325667 BOOLEAN  NOT NULL DEFAULT false,
    deleted BOOLEAN  NOT NULL DEFAULT false,
    pnv35_b78915325667 INT NOT NULL,
    pnv36_b78915325667 INT NOT NULL, 
    pnv37_b78915325667 VARCHAR(100)


 );
CREATE TABLE IF NOT EXISTS pnv51_b78915325667 (
    pnv2_b78915325667 SERIAL NOT NULL  PRIMARY KEY,
    pnv38_b78915325667 VARCHAR NOT NULL,
    pnv39_b78915325667 VARCHAR NOT NULL,
    pnv20_b78915325667 SERIAL NOT NULL REFERENCES hv2_b7891567567,
    pnv40_b78915325667 BIGINT REFERENCES pnv19_b78915325667,
    pnv41_b78915325667  VARCHAR NOT NULL,
    pnv42_b78915325667 VARCHAR NOT NULL DEFAULT md5(random()::text),
    pnv43_b78915325667 TIMESTAMPTZ NOT NULL DEFAULT now()
   

);

 CREATE TABLE IF NOT EXISTS  pnv44_b78915325667 (
     pnv2_b78915325667 SERIAL NOT NULL PRIMARY KEY,
     upnv2_b78915325667 SERIAL NOT NULL REFERENCES hv2_b7891567567,
     upnv2_b789153256672 SERIAL NOT NULL REFERENCES hv2_b7891567567 ,
     pnv46_b78915325667 INT NOT NULL DEFAULT 0,
     pnv45_b78915325667 VARCHAR NOT NULL,
     pnv26_b78915325667 TIMESTAMP NOT NULL DEFAULT now(),
     CONSTRAINT order_unique UNIQUE (upnv2_b789153256672)
);


 select column_name,data_type 
from information_schema.columns 
where table_name = 'pnv56_b78915325667';
 CREATE TABLE IF NOT EXISTS  follows (
     follwer_pnv2_b78915325667 INT NOT NULL REFERENCES hv2_b7891567567,
     follwee_pnv2_b78915325667 INT NOT NULL REFERENCES hv2_b7891567567,
     PRIMARY KEY (follwer_pnv2_b78915325667, follwee_pnv2_b78915325667)
 );
  CREATE TABLE IF NOT EXISTS  pnv47_b78915325667 (
     pnv2_b78915325667 SERIAL NOT NULL PRIMARY KEY,
     pnv45_b78915325667 VARCHAR NOT NULL,
     pnv37_b78915325667 VARCHAR NOT NULL,
     ppnv2_b78915325667 SERIAL ,
     upnv2_b78915325667 SERIAL NOT NULL REFERENCES hv2_b7891567567,
     pnv4_b78915325667 VARCHAR,
     gpnv2_b78915325667 SERIAL,
     pnv33_b78915325667 BOOLEAN NOT NULL DEFAULT false,
     pnv26_b78915325667 TIMESTAMP NOT NULL DEFAULT now()

);
 CREATE TABLE IF NOT EXISTS  pnv48_b78915325667 (
     pnv2_b78915325667 SERIAL NOT NULL PRIMARY KEY,
     ppnv2_b78915325667 SERIAL NOT NULL REFERENCES pnv19_b78915325667,
     upnv2_b78915325667 SERIAL NOT NULL REFERENCES hv2_b7891567567,
     gpnv2_b78915325667 SERIAL NOT NULL REFERENCES pnv51_b78915325667,
     pnv26_b78915325667 TIMESTAMP NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS pnv49_b78915325667(
    pnv20_b78915325667  SERIAL NOT NULL REFERENCES hv2_b7891567567,
    pnv40_b78915325667 SERIAL NOT NULL REFERENCES pnv19_b78915325667,
    PRIMARY KEY (pnv20_b78915325667, pnv40_b78915325667)

);
CREATE TABLE IF NOT EXISTS user_pnv46_b78915325667(
    pnv20_b78915325667  SERIAL NOT NULL REFERENCES hv2_b7891567567,
    pnv20_b789153256672 SERIAL NOT NULL REFERENCES hv2_b7891567567,
    PRIMARY KEY (pnv20_b78915325667, pnv20_b789153256672)

);
CREATE TABLE IF NOT EXISTS pnv50_b78915325667(
    pnv2_b78915325667 SERIAL PRIMARY KEY,
    pnv20_b78915325667 SERIAL NOT NULL REFERENCES hv2_b7891567567,
    name VARCHAR DEFAULT 'pnv50_b78915325667.png'
    
);
CREATE TABLE IF NOT EXISTS vpnv2_b78915325667jet(
    pnv2_b78915325667 SERIAL PRIMARY KEY,
    upnv2_b78915325667 SERIAL NOT NULL REFERENCES hv2_b7891567567,
    gpnv2_b78915325667 SERIAL NOT NULL REFERENCES pnv51_b78915325667,
    link VARCHAR(400) NOT NULL,
    pnv52_b78915325667 TIMESTAMP NOT NULL DEFAULT now()
    
);
CREATE TABLE IF NOT EXISTS pnv53_b78915325667(
    upnv2_b78915325667_in SERIAL NOT NULL REFERENCES hv2_b7891567567,
    upnv2_b78915325667_out SERIAL NOT NULL REFERENCES hv2_b7891567567,
PRIMARY KEY (upnv2_b78915325667_in, upnv2_b78915325667_out)
);
CREATE TABLE IF NOT EXISTS impnv35_b78915325667s(
    pnv2_b78915325667 SERIAL PRIMARY KEY,
    pnv20_b78915325667 SERIAL NOT NULL REFERENCES hv2_b7891567567,
    pnv40_b78915325667 SERIAL NOT NULL UNIQUE REFERENCES pnv19_b78915325667,
    name VARCHAR DEFAULT 'pnv50_b78915325667.png'
    
);
  CREATE TABLE IF NOT EXISTS  pnv54_b78915325667 (
     pnv2_b78915325667 SERIAL NOT NULL PRIMARY KEY,
     pnv45_b78915325667 VARCHAR NOT NULL,
     messpnv35_b78915325667s VARCHAR NOT NULL,
     upnv2_b78915325667_In SERIAL NOT NULL REFERENCES hv2_b7891567567,
     actors1 VARCHAR[] NOT NULL,
     actors2 VARCHAR[] NOT NULL,
     upnv2_b78915325667_Out SERIAL NOT NULL REFERENCES hv2_b7891567567,
     pnv26_b78915325667 TIMESTAMP NOT NULL DEFAULT now()

);
  CREATE TABLE IF NOT EXISTS  pnv55_b78915325667 (
     pnv2_b78915325667 SERIAL NOT NULL PRIMARY KEY,
     messpnv35_b78915325667s VARCHAR NOT NULL,
     upnv2_b78915325667_In SERIAL NOT NULL REFERENCES hv2_b7891567567,
     gpnv2_b78915325667 SERIAL NOT NULL REFERENCES pnv51_b78915325667,
     pnv26_b78915325667 TIMESTAMP NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS pnv56_b78915325667 (
    pnv2_b78915325667 SERIAL NOT NULL,
    pnv20_b78915325667 SERIAL NOT NULL REFERENCES hv2_b7891567567,
    actors VARCHAR[] NOT NULL,
    type VARCHAR NOT NULL,
    pnv40_b78915325667 BIGINT REFERENCES pnv19_b78915325667,
    pnv20_b789153256672 BIGINT REFERENCES hv2_b7891567567,
    read_at TIMESTAMPTZ,
    pnv43_b78915325667 TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS pnv57_b78915325667 (
    pnv2_b78915325667 SERIAL NOT NULL,
    pnv20_b78915325667 SERIAL NOT NULL REFERENCES hv2_b7891567567,
    actors VARCHAR[] NOT NULL,
    type VARCHAR NOT NULL,
    pnv40_b78915325667 BIGINT REFERENCES pnv19_b78915325667,
    pnv20_b789153256672 BIGINT REFERENCES hv2_b7891567567,
    read_at TIMESTAMPTZ,
    pnv43_b78915325667 TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pnv54_b78915325667fi (
    pnv2_b78915325667 SERIAL NOT NULL,
    pnv45_b78915325667 VARCHAR NOT NULL,
    messpnv35_b78915325667s VARCHAR NOT NULL,
    upnv2_b78915325667_in BIGINT REFERENCES hv2_b7891567567,
    upnv2_b78915325667_out BIGINT REFERENCES hv2_b7891567567,
    read_at VARCHAR(15),
    pnv26_b78915325667 TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS pnv58_b78915325667 (
    pnv2_b78915325667 SERIAL NOT NULL,
    ppnv2_b78915325667 BIGINT REFERENCES pnv19_b78915325667,
    upnv2_b78915325667 BIGINT REFERENCES hv2_b7891567567,
    upnv2_b78915325667m BIGINT REFERENCES hv2_b7891567567,
    gpnv2_b78915325667 BIGINT REFERENCES pnv51_b78915325667,
    pnv26_b78915325667 TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS pnv27_b78915325667s (
    pnv2_b78915325667 SERIAL NOT NULL  PRIMARY KEY,
    pnv27_b78915325667 VARCHAR NOT NULL,
    pnv43_b78915325667 TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS pnv27_b78915325667ss (
    pnv2_b78915325667 SERIAL NOT NULL  PRIMARY KEY,
    pnv27_b78915325667 VARCHAR NOT NULL,
    UNIQUE(pnv27_b78915325667),
    ppnv2_b78915325667 BIGINT  NOT NULL,
    upnv2_b78915325667 BIGINT REFERENCES hv2_b7891567567,
    pnv43_b78915325667 TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE  pnv27_b78915325667s_relation (
    tpnv2_b78915325667 SERIAL  NOT NULL,
    ppnv2_b78915325667 SERIAL  NOT NULL 
);

CREATE TABLE IF NOT EXISTS pnv60_b78915325667 (
    pnv2_b78915325667 SERIAL NOT NULL  PRIMARY KEY,
    pnv45_b78915325667 VARCHAR,
    type VARCHAR NOT NULL,
    upnv2_b78915325667 SERIAL NOT NULL REFERENCES hv2_b7891567567,
    upnv2_b789153256672 SERIAL REFERENCES hv2_b7891567567,
    ppnv2_b78915325667 SERIAL,
    gpnv2_b78915325667 SERIAL,
    pnv43_b78915325667 TIMESTAMPTZ NOT NULL DEFAULT now(),
    modcl varchar  not Null
);

CREATE TABLE  pnv61_b78915325667 (
     pnv2_b78915325667 SERIAL NOT NULL  PRIMARY KEY,
    upnv2_b78915325667 SERIAL  NOT NULL REFERENCES hv2_b7891567567,
    gpnv2_b78915325667 SERIAL  NOT NULL 
);

CREATE TABLE IF NOT EXISTS pnv56_b78915325667Mess (
    pnv2_b78915325667 SERIAL NOT NULL,
    pnv20_b78915325667 SERIAL NOT NULL REFERENCES hv2_b7891567567,
    actors VARCHAR[] NOT NULL,
    type VARCHAR NOT NULL,
    pnv20_b789153256672 SERIAL REFERENCES hv2_b7891567567,
    read_at TIMESTAMPTZ,
    pnv43_b78915325667 TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pnv62_b78915325667(
    upnv2_b78915325667 SERIAL NOT NULL REFERENCES hv2_b7891567567,
    gpnv2_b78915325667 SERIAL NOT NULL REFERENCES pnv51_b78915325667,
PRIMARY KEY (upnv2_b78915325667, gpnv2_b78915325667)
);
CREATE INDEX IF NOT EXISTS sported_pnv19_b78915325667 ON pnv19_b78915325667 (pnv26_b78915325667 DESC);
 CREATE TABLE IF NOT EXISTS pnv63_b78915325667 (
      pnv2_b78915325667 SERIAL PRIMARY KEY,
       pnv20_b78915325667  SERIAL NOT NULL REFERENCES hv2_b7891567567,
    pnv40_b78915325667 SERIAL NOT NULL
 );
 CREATE TABLE IF NOT EXISTS post_subscriptions (
    pnv20_b78915325667 SERIAL NOT NULL REFERENCES hv2_b7891567567,
    pnv40_b78915325667 SERIAL NOT NULL,
    PRIMARY KEY (pnv20_b78915325667, pnv40_b78915325667)
 );
 CREATE UNIQUE INDEX IF NOT EXISTS pnv63_b78915325667_unique ON pnv63_b78915325667 (pnv20_b78915325667, pnv40_b78915325667);



/*INSERT INTO hv2_b7891567567 (pnv2_b78915325667, pnv3_b78915325667, pnv4_b78915325667) pnv45_b78915325667S 
(1, 'JOHN', 'alex@ya.com'),
(2, 'Jina', 'jinna@ya.com');*/
CREATE UNIQUE INDEX unique_pnv56_b78915325667 ON pnv56_b78915325667 (pnv20_b78915325667, type, pnv40_b78915325667, read_at, pnv20_b789153256672  );
/*
INSERT INTO pnv50_b78915325667 (pnv2_b78915325667, pnv20_b78915325667, name) 
pnv45_b78915325667S (1, 589787864940871681, '1500x500.jpeg');
ALTER TABLE pnv56_b78915325667 ALTER COLUMN pnv40_b78915325667 TYPE BIGINT;
*/
/*
INSERT INTO pnv50_b78915325667 ( "pnv20_b78915325667", "name") pnv45_b78915325667S ( 592939641249497089, 'pnv50_b78915325667.png') ON CONFLICT (pnv2_b78915325667) DO UPDATE SET name = 'pnv50_b78915325667.png';

INSERT INTO pnv50_b78915325667 ( pnv20_b78915325667, name) pnv45_b78915325667S ( 592939641249497089, 'pnv50_b78915325667.png') ON DUPLICATE KEY UPDATE pnv20_b78915325667 = 592939641249497089, name = 'pnv50_b78915325667.png';

SELECT hv2_b7891567567.pnv2_b78915325667, pnv3_b78915325667, pnv16_b78915325667, pnv18_b78915325667,  followers.follwer_pnv2_b78915325667 IS NOT NULL AS following, followees.follwee_pnv2_b78915325667 IS NOT NULL AS followeed, pnv50_b78915325667.name FROM hv2_b7891567567 LEFT JOIN follows AS followers ON followers.follwer_pnv2_b78915325667 = 589787864940871681 AND followers.follwee_pnv2_b78915325667 = hv2_b7891567567.pnv2_b78915325667 LEFT JOIN follows AS followees ON followees.follwer_pnv2_b78915325667 = hv2_b7891567567.pnv2_b78915325667 AND followees.follwee_pnv2_b78915325667 = 589787864940871681 LEFT JOIN pnv50_b78915325667 ON pnv50_b78915325667.pnv20_b78915325667 = pnv50_b78915325667.pnv20_b78915325667  AND pnv50_b78915325667.pnv20_b78915325667 = 589787864940871681 WHERE pnv4_b78915325667 = 'alex';
SELECT hv2_b7891567567.pnv2_b78915325667, pnv3_b78915325667, pnv16_b78915325667, pnv18_b78915325667,  followers.follwer_pnv2_b78915325667 IS NOT NULL AS following, followees.follwee_pnv2_b78915325667 IS NOT NULL AS followeed FROM hv2_b7891567567 LEFT JOIN follows AS followers ON followers.follwer_pnv2_b78915325667 = 589787864940871681 AND followers.follwee_pnv2_b78915325667 = hv2_b7891567567.pnv2_b78915325667 LEFT JOIN follows AS followees ON followees.follwer_pnv2_b78915325667 = hv2_b7891567567.pnv2_b78915325667 AND followees.follwee_pnv2_b78915325667 = 589787864940871681 LEFT JOIN pnv50_b78915325667 ON pnv50_b78915325667.pnv20_b78915325667 = pnv50_b78915325667.pnv20_b78915325667  AND pnv50_b78915325667.pnv20_b78915325667 = 589787864940871681 WHERE pnv4_b78915325667 = 'alex';
*/