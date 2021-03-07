package service

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/hako/branca"
)

type TokenOutput struct {
	Token     string    `json:"token"`
	ExpiresAt time.Time `json:"expiresAt"`
}

const KeyAuthUserId = ctxkey("auth_user_id")
const (
	verificationCodeLifespan     = time.Minute * 15
	TokenLifespan                = time.Hour * 24 * 14
	KeyAuthUserID            key = "auth_user_id"
)

type ctxkey string

var (
	ErrUnauticated = errors.New("unauthenticated")
)

type LoginOutput struct {
	Token     string
	ExpiresAt time.Time
	AuthUser  User
	Name      string
	URL       string
}
type key string

func (s *Service) AuthUserID(token string) (string, error) {
	str, err := s.codec().DecodeToString(token)
	if err != nil {
		return "", fmt.Errorf("couldnt decode token: %v", err)
	}

	if err != nil {
		return "", fmt.Errorf("coudnt: %v", err)
	}
	return str, nil
}
func (s *Service) Login(ctx context.Context, email string, pass string) (LoginOutput, error) {
	var out LoginOutput
	fmt.Println(pass, "passpasspasspasspass")
	email = strings.TrimSpace(email)
	if !rxEmail.MatchString(email) {
		return out, ErrInvalidEmail
	}
	query := "SELECT users.id, username, avatar.name FROM users LEFT JOIN avatar ON avatar.user_id = users.id AND users.id = avatar.user_id WHERE password=$2 AND email = $1  "

	err := s.db.QueryRowContext(ctx, query, email, pass).Scan(&out.AuthUser.ID, &out.AuthUser.Username, &out.Name)
	if err == sql.ErrNoRows {
		return out, ErrUserNoFound
	}
	if err != nil {
		return out, err
	}
	out.Token, err = s.codec().EncodeToString(out.AuthUser.ID)
	if err != nil {

		return out, err
	}
	out.ExpiresAt = time.Now().Add(TokenLifespan)
	out.URL, err = getObject("processed/100x100/" + out.Name)
	client := getClient()
	json, err := json.Marshal(out)
	if err != nil {
		return out, fmt.Errorf("coudnt commit create post: %v", err)
	}
	_, err = client.Set(ctx, out.AuthUser.ID, json, 0).Result()

	if err != nil {
		return out, fmt.Errorf("coudnt commit create post: %v", err)
	}
	return out, nil
}
func (s *Service) AuthUser(ctx context.Context) (User, error) {
	var u User
	uid, ok := ctx.Value(KeyAuthUserID).(string)
	if !ok {
		return u, ErrUnauticated
	}
	return s.userById(ctx, uid)
}
func (s *Service) codec() *branca.Branca {
	cdc := branca.NewBranca(s.tokenKey)
	cdc.SetTTL(uint32(TokenLifespan.Seconds()))
	return cdc
}

func (s *Service) Token(ctx context.Context) (TokenOutput, error) {
	var out TokenOutput
	uid, ok := ctx.Value(KeyAuthUserID).(string)
	if !ok {
		return out, ErrUnauthenticated
	}

	var err error
	out.Token, err = s.codec().EncodeToString(uid)
	if err != nil {
		return out, fmt.Errorf("could not create token: %v", err)
	}

	out.ExpiresAt = time.Now().Add(TokenLifespan)

	return out, nil
}

func (s *Service) deleteExpiredVerificationCodesJob() {
	ticker := time.NewTicker(time.Hour * 24)
	ctx := context.Background()
	done := ctx.Done()
	for {
		select {
		case <-ticker.C:
			if err := s.deleteExpiredVerificationCodes(ctx); err != nil {
				log.Println(err)
			}
		case <-done:
			ticker.Stop()
			return
		}
	}
}
func (s *Service) deleteExpiredVerificationCodes(ctx context.Context) error {
	query := fmt.Sprintf("DELETE FROM verification_codes WHERE (created_at - INTERVAL '%dm') <= now()", int64(verificationCodeLifespan.Minutes()))
	if _, err := s.db.ExecContext(ctx, query); err != nil {
		return fmt.Errorf("could not delete expired verification code: %w", err)
	}
	return nil
}
