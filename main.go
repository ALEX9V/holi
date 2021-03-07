package main

import (
	"database/sql"
	"errors"
	"flag"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"os"
	"social/internal/handler"
	"social/internal/pubsub/nats"
	"social/internal/service"
	"strconv"
	"time"

	"github.com/hako/branca"
	_ "github.com/jackc/pgx/stdlib"
	"github.com/joho/godotenv"
	natslib "github.com/nats-io/nats.go"
)

func main() {
	_ = godotenv.Load()
	if err := run(); err != nil {
		log.Fatalln(err)
	}
}
func run() error {
	var (
		port, _   = strconv.Atoi(env("PORT", "3000"))
		originStr = env("ORIGIN", fmt.Sprintf("http://localhost:%d", port))
		dbURL     = env("DATABASE_URL", "postgresql://root@127.0.0.1:26257/frelanserh?sslmode=disable")
		tokenKey  = env("TOKEN_KEY", "supersecretkeyyoushouldnotcommit")
		natsURL   = env("NATS_URL", natslib.DefaultURL)
	)
	flag.Usage = func() {
		flag.PrintDefaults()
		fmt.Println("\nDon't forget to set TOKEN_KEY, SMTP_USERNAME and SMTP_PASSWORD for real usage.")
	}
	flag.IntVar(&port, "port", port, "Port in which this server will run")
	flag.StringVar(&originStr, "origin", originStr, "URL origin for this service")
	flag.StringVar(&dbURL, "db", dbURL, "Database URL")
	flag.StringVar(&natsURL, "nats", natsURL, "NATS URL")
	flag.Parse()
	origin, err := url.Parse(originStr)
	if err != nil || !origin.IsAbs() {
		return errors.New("invalid url origin")
	}

	db, err := sql.Open("pgx", dbURL)
	if err != nil {
		log.Print("error to connection", err)
	}

	defer db.Close()
	if err = db.Ping(); err != nil {
		log.Fatal("codnt ping to db", err)
	}
	natsConn, err := natslib.Connect(natsURL)
	if err != nil {
		return fmt.Errorf("could not connect to NATS server: %w", err)
	}
	pubsub := &nats.PubSub{Conn: natsConn}

	codec := branca.NewBranca(tokenKey)
	codec.SetTTL(uint32(service.TokenLifespan.Seconds()))
	service := service.New(service.Conf{
		DB: db,
		//Sender:   sender,
		Origin:   origin,
		TokenKey: tokenKey,
		PubSub:   pubsub,
	})

	server := http.Server{
		Addr:              fmt.Sprintf(":%d", port),
		Handler:           handler.New(service, origin.Hostname() == "localhost"),
		ReadHeaderTimeout: time.Second * 5,
		ReadTimeout:       time.Second * 15,
	}
	errs := make(chan error, 2)

	go func() {
		log.Printf("accepting connections on port %d\n", port)
		log.Printf("starting server at %s\n", origin)
		if err = server.ListenAndServe(); err != http.ErrServerClosed {
			errs <- fmt.Errorf("could not listen and serve: %w", err)
			return
		}

		errs <- nil
	}()

	return <-errs
}

func env(key, fallbackValue string) string {
	s := os.Getenv(key)
	if s == "" {
		return fallbackValue
	}
	return s
}
