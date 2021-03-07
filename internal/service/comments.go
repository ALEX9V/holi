package service

import (
	"bytes"
	"context"
	"encoding/gob"
	"fmt"
	"io"
	"log"
	"strconv"
	"time"
)

type Com struct {
	Groupim   []Groupim
	ID        string
	Value     string
	Pid       string
	UID       string
	Tittle    string
	Username  string
	Count     string
	Name      string
	URL       string
	User      *User
	Mine      bool
	Sel       bool
	CreatedAt time.Time
}

func (s *Service) CrateCmmment(ctx context.Context, pid int64, value string, title string, username string) (Com, error) {
	var com Com
	//user := "alex"

	uid, auth := ctx.Value(KeyAuthUserID).(string)
	if !auth {
		return com, ErrUnauthenticated
	}
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return com, fmt.Errorf("coudnt:%v", err)
	}
	types := "comment"
	modcl := "postcom"
	defer tx.Rollback()
	//username := "hi"
	query := `INSERT INTO comments (value, title, pid, uid, username ) VALUES ($1, $2,  $3,  $4, $5 ) RETURNING id, created_at`
	if err = s.db.QueryRowContext(ctx, query, value, title, pid, uid, username).Scan(&com.ID, &com.CreatedAt); err != nil {

		return com, fmt.Errorf("error:%v", err)
	}
	query = "INSERT INTO post_subscriptions (user_id, post_id) VALUES ($1, $2) ON CONFLICT (user_id, post_id) DO NOTHING "
	if _, err = s.db.ExecContext(ctx, query, uid, pid); err != nil {
		return com, fmt.Errorf("coudnt insert timeline: %v", err)
	}
	query = `INSERT INTO gpall (value, type, pid, uid, uid2, modcl ) VALUES ($1, $2,  $3,  $4, $4, $5 ) RETURNING id`
	_, err = s.db.ExecContext(ctx, query, title, types, pid, uid, modcl)
	if err != nil {
		return com, fmt.Errorf("error:%v", err)
	}
	query = `select user_id from posts where id=$1`
	userid := ""
	if err = s.db.QueryRowContext(ctx, query, pid).Scan(&userid); err != nil {

		return com, fmt.Errorf("error:%v", err)
	}
	actor := []string{username}
	query = `INSERT INTO notifications (user_id, actors, type, post_id ) VALUES ($1, $2,  $3,  $4 ) RETURNING id`
	_, err = s.db.ExecContext(ctx, query, userid, actor, types, pid)
	if err != nil {
		return com, fmt.Errorf("error:%v", err)
	}
	query = `UPDATE posts SET comments_count = comments_count + 1 WHERE id = $1 RETURNING comments_count`
	if err = s.db.QueryRowContext(ctx, query, pid).Scan(&com.Count); err != nil {

		return com, fmt.Errorf("error:%v", err)
	}
	query = `SELECT name FROM avatar WHERE user_id = $1 `
	if err = s.db.QueryRowContext(ctx, query, uid).Scan(&com.Name); err != nil {

		return com, fmt.Errorf("error:%v", err)
	}
	if err != nil {
		log.Fatal(err)
	}

	com.Value = value
	com.Tittle = title
	com.Pid = strconv.FormatInt(pid, 10)
	com.UID = uid

	com.URL, _ = getObject("processed/100x100/" + com.Name)
	if err != nil {
		return com, fmt.Errorf("coudnt create comment: %v ", err)
	}
	var gg Group
	gg.Value = value
	gg.Tittle = title
	gg.PID = strconv.FormatInt(pid, 10)
	gg.UID = uid
	gg.Type = types
	gg.ModCl = modcl
	query = ` SELECT id from  users `
	rows, err := tx.QueryContext(ctx, query)
	if err != nil {
		return com, fmt.Errorf("error:%v", err)
	}
	fmt.Println("brod1")
	for rows.Next() {
		var cms Group
		if err = rows.Scan(&cms.UID); err != nil {
			return com, fmt.Errorf("error:%v", err)
		}
		gg.UID = cms.UID
		go s.comentCreated(gg)
	}
	if err = tx.Commit(); err != nil {
		return com, fmt.Errorf("coudnt commit:%v", err)
	}

	return com, nil
}
func (s *Service) comentCreated(g Group) {

	go s.broadcastGp(g)

}
func (s *Service) GetAll(ctx context.Context, pid int64) ([]Com, error) {

	fmt.Println(pid)
	fmt.Println("GetAllbroadcastComment")
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return nil, fmt.Errorf("coudnt:%v", err)
	}
	defer tx.Rollback()
	cm := make([]Com, 0, 4)
	query := ` SELECT title, comments.id, pid, uid, users.username, avatar.name,  selecter
	FROM comments 
	INNER JOIN users ON comments.uid = users.id 
	INNER JOIN avatar ON avatar.user_id = uid  
	WHERE pid = $1 
	ORDER BY created_at DESC 
	LIMIT 4 `
	rows, err := tx.QueryContext(ctx, query, pid)
	if err != nil {
		return nil, fmt.Errorf("coudnt:%v", err)
	}
	for rows.Next() {
		var cms Com
		if err = rows.Scan(&cms.Tittle, &cms.ID, &cms.Pid, &cms.UID, &cms.Username, &cms.Name, &cms.Sel); err != nil {
			return nil, fmt.Errorf("sql error:%v", err)
		}
		cms.URL, _ = getObject("processed/100x100/" + cms.Name)
		cm = append(cm, cms)
	}

	return cm, nil

}
func (s *Service) UpdateCom(ctx context.Context, cid int64, value string, title string) (Com, error) {
	var com Com

	fmt.Println("update")
	uid, auth := ctx.Value(KeyAuthUserID).(int64)
	if !auth {
		return com, fmt.Errorf("auth:%v", auth)
	}
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return com, fmt.Errorf("coudnt:%v", err)
	}
	defer tx.Rollback()
	fmt.Println(value, title, uid, cid)
	query := `UPDATE comments SET value = $1, title = $2 
	WHERE uid = $3 AND id = $4 
	RETURNING value, title`
	if err = tx.QueryRowContext(ctx, query, value, title, uid, cid).Scan(&com.Tittle, &com.Value); err != nil {
		return com, fmt.Errorf("sql:%v", err)
	}
	if err = tx.Commit(); err != nil {
		return com, fmt.Errorf("coudnt commit:%v", err)
	}
	fmt.Println("shag1")
	if err != nil {
		return com, fmt.Errorf("coudnt create comment: %v ", err)
	}
	return com, nil
}

// CommentStream to receive comments in realtime.
func (s *Service) CommentStream(ctx context.Context, postID string) (<-chan Com, error) {

	cc := make(chan Com)
	uid, auth := ctx.Value(KeyAuthUserID).(string)
	fmt.Println(cc)

	unsub, err := s.pubsub.Sub(commentTopic(postID), func(data []byte) {
		go func(r io.Reader) {
			var c Com
			err := gob.NewDecoder(r).Decode(&c)
			if err != nil {
				log.Printf("could not gob decode comment: %v\n", err)
				return
			}

			if auth && uid == c.UID {
				return
			}

			cc <- c
		}(bytes.NewReader(data))
	})
	if err != nil {
		return nil, fmt.Errorf("could not subscribe to comments: %v", err)
	}

	go func() {
		<-ctx.Done()
		if err := unsub(); err != nil {
			log.Printf("could not unsubcribe from comments: %v\n", err)
			// don't return
		}
		close(cc)
	}()
	fmt.Println("CommentStream", cc)
	return cc, nil
}
func commentTopic(postID string) string { return "comment_" + postID }
func (s *Service) broadcastComment(c Com) {
	var b bytes.Buffer
	err := gob.NewEncoder(&b).Encode(c)
	if err != nil {
		log.Printf("could not gob encode comment: %v\n", err)
		return
	}
	fmt.Println("broadcastComment", c)
	err = s.pubsub.Pub(commentTopic(c.Pid), b.Bytes())
	if err != nil {
		log.Printf("could not publish comment: %v\n", err)
		return
	}
}

//comment/edit/582754298696728577
//ATki9UzfrHQgBStYMoBvNiIdpChJ0LaMzTagCCtCU1dcJuBKNBQh7FAV7wbEoJCKKCZurrVIkPpYjng34elI4
