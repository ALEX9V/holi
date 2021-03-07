package service

import (
	"database/sql"
	"net/url"
	"social/internal/pubsub"
)

type Service struct {
	db *sql.DB
	//	codec    *branca.Branca
	origin   *url.URL
	tokenKey string
	pubsub   pubsub.PubSub
}

type Conf struct {
	DB *sql.DB
	//Sender   mailing.Sender
	Origin   *url.URL
	TokenKey string
	PubSub   pubsub.PubSub
	//	Codec    *branca.Branca
}

// New service implementation.
func New(conf Conf) *Service {
	s := &Service{
		db: conf.DB,
		//codec:  conf.Codec,
		origin:   conf.Origin,
		tokenKey: conf.TokenKey,
		pubsub:   conf.PubSub,
	}
	go s.deleteExpiredVerificationCodesJob()

	return s
}
