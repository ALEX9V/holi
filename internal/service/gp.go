package service

import (
	"bytes"
	"context"
	"encoding/gob"
	"errors"
	"fmt"
	"log"
)

var ErrInvalidGroupID = errors.New("invalid notification id")

// Groups from the authenticated user in descending order with backward pagination.
func (s *Service) Gps(ctx context.Context, last int, before string) ([]Group, error) {

	uid, ok := ctx.Value(KeyAuthUserID).(string)
	if !ok {
		return nil, ErrUnauthenticated
	}
	fmt.Println(before)

	last = normalizePageSize(last)
	query, args, err := buildQuery(`
		SELECT *
		FROM gpall
		WHERE uid = @uid 
		ORDER BY issued_at DESC
		`, map[string]interface{}{
		"uid":    uid,
		"before": before,
	})
	if err != nil {
		return nil, fmt.Errorf("could not build notifications sql query: %v", err)
	}

	rows, err := s.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("could not query select notifications: %v", err)
	}

	defer rows.Close()

	nn := make([]Group, 0, last)
	for rows.Next() {
		var n Group

		if err = rows.Scan(&n.ID, &n.Value, &n.Type, &n.UID, &n.UID2, &n.IssuedAt, &n.GID, &n.PID); err != nil {
			return nil, fmt.Errorf("could not scan notification: %v", err)
		}

		nn = append(nn, n)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("could not iterate over notification rows: %v", err)
	}

	return nn, nil
}
func gpTopic(GID string) string { return "message_" + GID }
func (s *Service) broadcastGp(g Group) {
	var b bytes.Buffer
	err := gob.NewEncoder(&b).Encode(g)
	if err != nil {
		log.Printf("could not gob encode comment: %v\n", err)
		return
	}

	err = s.pubsub.Pub(commentTopic(g.UID), b.Bytes())
	if err != nil {
		log.Printf("could not publish comment: %v\n", err)
		return
	}

}
