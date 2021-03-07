package service

import (
	"bytes"
	"context"
	"encoding/gob"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"time"

	"github.com/lib/pq"
)

type Mess struct {
	ID         string
	Messages   string
	Sender     string
	Retriver   string
	Me         string
	UsersnameR string
	file       string
	CreatedAt  time.Time
	Mine       bool
	UID        string
	User       *User
	Tittle     string
	Read       string
	Value      string
	URL        string
}
type Hrlmmzz []Mess

func (s *Service) CrateMessange(ctx context.Context, uid2 string, message string, value string, lh09MVP string) (Mess, error) {
	var mes Mess
	//user := "alex"
	fmt.Println(uid2)
	fmt.Println(message)
	uid, auth := ctx.Value(KeyAuthUserID).(string)
	if !auth {
		return mes, ErrUnauthenticated
	}
	clientt := getClient()
	val, err := clientt.Get(ctx, fmt.Sprint(uid)).Result()
	if err != nil {
		fmt.Println(err)
	}
	var usr LoginOutput

	err = json.Unmarshal([]byte(val), &usr)

	if usr.Token != lh09MVP {
		return mes, ErrUnauthenticated
	}
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return mes, fmt.Errorf("coudnt:%v", err)
	}
	defer tx.Rollback()
	//username := "hi"
	fmt.Print("value", value)
	query := "INSERT INTO messanges_notyfi ( uid_in, uid_out, messages, value ) VALUES ($1, $2, $3, $4) RETURNING id "
	if err = tx.QueryRowContext(ctx, query, uid, uid2, message, value).Scan(&mes.ID); err != nil {
		return mes, fmt.Errorf("coudnt insert messanges_noty: %v", err)
	}
	mes.UID = uid
	mes.Sender = uid
	mes.Retriver = uid2
	mes.Messages = message
	mes.Value = value
	u, err := s.userById(context.Background(), mes.UID)
	if err != nil {
		fmt.Println("coudnt comment user", err)
		return mes, nil
	}

	mes.User = &u
	mes.UsersnameR = mes.User.Username
	if err != nil {
		log.Fatal(err)
	}

	query = "INSERT INTO timelinemess ( uid_in, uid_out ) VALUES ($1, $2) ON CONFLICT (uid_in, uid_out) DO NOTHING  "
	if _, err = tx.ExecContext(ctx, query, uid, uid2); err != nil {
		return mes, fmt.Errorf("coudnt insert messanges_noty: %v", err)
	}

	if err = tx.Commit(); err != nil {
		return mes, fmt.Errorf("coudnt commit create post: %v", err)
	}
	var gg Group
	gg.ModCl = "mess"
	gg.UID = uid2
	gg.Sender = uid
	gg.Retriver = uid2
	gg.Messages = message
	gg.Value = value
	gg.Username = mes.UsersnameR
	if mes.Messages != "typing" {
		mes.Mine = false
		go s.notifyCommentMess(mes)
	}
	_ = clientt.Del(ctx, "mess_Pt"+uid)
	go s.broadcastGp(gg)

	return mes, nil
}

func (s *Service) GetAllMess(ctx context.Context, uid2 string, before string, befores int64, last int, lh09MVP string) ([]Mess, error) {
	fmt.Println(uid2, "shag2")
	fmt.Println(befores, "befores")
	var uid string

	if before == "" {
		uid, _ = ctx.Value(KeyAuthUserID).(string)

		fmt.Print(uid)
	} else {
		uid, _ = s.codec().DecodeToString(before)

	}
	clientt := getClient()
	val, err := clientt.Get(ctx, fmt.Sprint(uid)).Result()
	if err != nil {
		fmt.Println(err)
	}
	var usr LoginOutput

	err = json.Unmarshal([]byte(val), &usr)

	if usr.Token != lh09MVP {
		return nil, ErrUnauthenticated
	}
	fmt.Println(uid, "GetAllMess")
	fmt.Println("shag")
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return nil, fmt.Errorf("coudnt:%v", err)
	}
	fmt.Println(uid2)
	defer tx.Rollback()

	cm := make([]Mess, 0, 4)
	tp := "typing"
	args := []interface{}{uid, uid2, tp}
	last = normalizePageSize(last)
	query := `UPDATE messanges_notyfi SET read_at='read' WHERE  uid_in=$1 AND uid_out=$2 or (uid_in=$2 AND uid_out=$1)`
	if _, err = tx.ExecContext(ctx, query, uid, uid2); err != nil {
		return nil, fmt.Errorf("coudnt insert messanges_noty: %v", err)
	}
	query = ``
	if befores != 0 {
		query += ` SELECT  messanges_notyfi.id, messages, uid_in, uid_out, users.username, uid_in = $1 AS mine, value FROM messanges_notyfi INNER JOIN users ON users.id = messanges_notyfi.uid_in WHERE messanges_notyfi.id < $4 and messages <> $3 and  uid_in = $1 AND uid_out=$2 OR uid_out = $1 AND uid_in=$2 and messages <> $3 AND messanges_notyfi.id < $4 ORDER BY created_at DESC LIMIT 15`

		args = append(args, befores)
		fmt.Println(query)
	} else {

		query += `SELECT  messanges_notyfi.id, messages, uid_in, uid_out, users.username, uid_in = $1 AS mine, value FROM messanges_notyfi INNER JOIN users ON users.id = messanges_notyfi.uid_in WHERE messages <> $3 and  uid_in = $1 AND uid_out=$2 OR uid_out = $1 AND uid_in=$2 and messages <> $3 ORDER BY created_at DESC LIMIT 15`
		fmt.Println(query)
	}
	rows, err := tx.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("coudnt:%v", err)
	}

	defer rows.Close()
	for rows.Next() {

		var cms Mess
		if err = rows.Scan(&cms.ID, &cms.Messages, &cms.Retriver, &cms.Sender, &cms.UsersnameR, &cms.Mine, &cms.Value); err != nil {
			return nil, fmt.Errorf("sql error:%v", err)
		}

		cm = append(cm, cms)
	}
	if err = tx.Commit(); err != nil {
		return nil, fmt.Errorf("coudnt create comment: %v ", err)
	}
	return cm, nil

}
func (s *Service) Timelinemess(ctx context.Context, before int64, lh09MVP string) ([]Mess, error) {

	uid, ok := ctx.Value(KeyAuthUserID).(string)
	if !ok {
		return nil, ErrUnauthenticated
	}
	clientt := getClient()
	val, err := clientt.Get(ctx, fmt.Sprint(uid)).Result()
	if err != nil {
		fmt.Println(err)
	}
	var usr LoginOutput

	err = json.Unmarshal([]byte(val), &usr)

	if usr.Token != lh09MVP {
		return nil, ErrUnauthenticated
	}
	valn, err := clientt.Get(ctx, "mess_Pt"+uid).Result()
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(val, "val")
	var cm1 Hrlmmzz

	if err != nil {
		// handle error
	}
	err = json.Unmarshal([]byte(valn), &cm1)

	if err != nil {
		fmt.Println("coudnt:%v", err)
	}

	if valn != "" {
		fmt.Println(cm1, "valvalval")
		return cm1, nil
	}
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return nil, fmt.Errorf("coudnt:%v", err)
	}

	defer tx.Rollback()

	cm := make([]Mess, 0, 4)
	query, args, err := buildQuery(`SELECT  uid_in, users.username, avatar.name, (SELECT (messages,'&&^%$%&&*^&**', created_at, read_at) AS messages FROM messanges_notyfi WHERE messanges_notyfi.messages!='typing' AND uid_in=@uid AND uid_out=talks.uid_in OR messanges_notyfi.messages!='typing' AND uid_in=talks.uid_in AND uid_out=@uid ORDER BY created_at DESC 
		LIMIT 1)
	FROM (SELECT uid_in
		FROM timelinemess
		WHERE uid_out = @uid
		UNION SELECT uid_out
		FROM timelinemess 
		WHERE uid_in = @uid) as talks  
		INNER JOIN users ON users.id = uid_in 
		INNER JOIN avatar ON avatar.user_id = uid_in  
		{{if .before}} WHERE users.id < @before {{end}} 
		ORDER BY users.id DESC
LIMIT 7
	
	`,
		map[string]interface{}{
			"before": before,
			"uid":    uid,
		})
	rows, err := tx.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("coudnt:%v", err)
	}
	defer rows.Close()
	for rows.Next() {

		var cms Mess
		if err = rows.Scan(&cms.ID, &cms.UsersnameR, &cms.file, &cms.Messages); err != nil {
			return nil, fmt.Errorf("sql error:%v", err)
		}
		cms.URL, _ = getObject("processed/100x100/" + cms.file)

		fmt.Println(cms.ID+cms.Messages+cms.Sender, "cms.ID + cms.Messages + cms.Retriver + cms.Sender")
		cm = append(cm, cms)
	}
	json, err := json.Marshal(cm)
	if err != nil {
		return nil, fmt.Errorf("sql error:%v", err)
	}
	_, err = clientt.Set(ctx, "mess_Pt"+uid, json, 0).Result()

	if err != nil {
		return nil, fmt.Errorf("sql error:%v", err)
	}
	return cm, nil

}

func messTopic(postID string) string { return "message_" + postID }
func (s *Service) MessageStream(ctx context.Context, before string, lh09MVP string) (<-chan Mess, error) {

	mm := make(chan Mess)

	uid, _ := s.codec().DecodeToString(before)
	fmt.Println(uid, "NotificationStream")

	fmt.Println(ctx, "uids")

	fmt.Println(mm)
	clientt := getClient()
	val, err := clientt.Get(ctx, fmt.Sprint(uid)).Result()
	if err != nil {
		fmt.Println(err)
	}
	var usr LoginOutput

	err = json.Unmarshal([]byte(val), &usr)

	if usr.Token != lh09MVP {
		return nil, ErrUnauthenticated
	}
	unsub, err := s.pubsub.Sub(messTopic(uid), func(data []byte) {
		go func(r io.Reader) {
			var m Mess

			err := gob.NewDecoder(r).Decode(&m)

			if err != nil {
				log.Printf("could not gob decode comment: %v\n", err)
				return
			}
			fmt.Println(m, "var m Mess")
			mm <- m
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
		fmt.Println("goMessStream", mm)
		close(mm)
	}()
	fmt.Println("MessStreamz", mm)
	return mm, nil

}
func (s *Service) notifyCommentMess(m Mess) {
	actor := m.User.Username

	fmt.Println(m.User.ID, m.Retriver, "Retriver")
	rows, err := s.db.Query(`
		INSERT INTO notifications (user_id, actors, type, user_id2)
		SELECT uid_in, $1, 'message', $2 FROM timelinemess
		WHERE timelinemess.uid_in = $2
			AND timelinemess.uid_out = $3
		ON CONFLICT (user_id, type, post_id, read_at, user_id2) DO UPDATE SET
			actors = array_prepend($4, array_remove(notifications.actors, $4)),
			issued_at = now()
		RETURNING id, user_id, actors, issued_at`,
		pq.Array([]string{actor}),
		m.Retriver,
		m.User.ID,
		actor,
	)
	if err != nil {
		log.Printf("could not insert comment notifications: %v\n", err)
		return
	}

	defer rows.Close()

	for rows.Next() {
		var n Notification
		if err = rows.Scan(&n.ID, &n.UserID, pq.Array(&n.Actors), &n.IssuedAt); err != nil {
			log.Printf("could not scan comment notification: %v\n", err)
			return
		}

		n.Type = "message"
		n.PostID = &m.Retriver

		go s.broadcastNotification(n)
	}

	if err = rows.Err(); err != nil {
		log.Printf("could not iterate over comment notification rows: %v\n", err)
		return
	}
}

func (s *Service) notifyCommentMentionMess(m Mess) {
	mentions := collectMentions(m.Tittle)
	if len(mentions) == 0 {
		return
	}

	actor := m.User.Username
	fmt.Println(actor, "INSERT INTO notifications")
	rows, err := s.db.Query(`
		INSERT INTO notifications (user_id, actors, type, user_id2)
		SELECT users.id, $1, 'comment_mention', $2 FROM users
		WHERE users.id = $2
			AND username = ANY($4)
		ON CONFLICT (user_id, type, post_id, read_at, user_id2) DO UPDATE SET
			actors = array_prepend($5, array_remove(notifications.actors, $5)),
			issued_at = now()
		RETURNING id, user_id, actors, issued_at`,
		pq.Array([]string{actor}),
		m.Retriver,
		m.UID,
		pq.Array(mentions),
		actor,
	)
	if err != nil {
		log.Printf("could not insert comment mention notifications: %v\n", err)
		return
	}

	defer rows.Close()

	for rows.Next() {
		var n Notification
		if err = rows.Scan(&n.ID, &n.UserID, pq.Array(&n.Actors), &n.IssuedAt); err != nil {
			log.Printf("could not scan comment mention notification: %v\n", err)
			return
		}

		n.Type = "comment_mention"
		n.PostID = &m.Retriver

		go s.broadcastNotification(n)
	}

	if err = rows.Err(); err != nil {
		log.Printf("could not iterate comment mention notification rows: %v\n", err)
		return
	}
}

func (s *Service) broadcastMess(m Mess) {
	var b bytes.Buffer
	err := gob.NewEncoder(&b).Encode(m)
	if err != nil {
		log.Printf("could not gob encode comment: %v\n", err)
		return
	}

	err = s.pubsub.Pub(messTopic(m.Retriver), b.Bytes())
	if err != nil {
		log.Printf("could not publish comment: %v\n", err)
		return
	}

}

func (s *Service) MarkMessAsRead(ctx context.Context, notificationID string, lh09MVP string) error {
	uid, ok := ctx.Value(KeyAuthUserID).(string)
	fmt.Println(uid)
	fmt.Println(notificationID)
	clientt := getClient()
	val, err := clientt.Get(ctx, fmt.Sprint(uid)).Result()
	if err != nil {
		fmt.Println(err)
	}
	var usr LoginOutput

	err = json.Unmarshal([]byte(val), &usr)

	if usr.Token != lh09MVP {
		return ErrUnauthenticated
	}
	if !ok {
		return ErrUnauthenticated
	}

	if _, err := s.db.Exec(`
		UPDATE notifications SET read_at = now()
		WHERE user_id = $2 AND user_id2 = $1  read_at IS NULL AND user_id = $1 AND user_id2 = $2  AND read_at IS NULL`, uid, notificationID); err != nil {

		return fmt.Errorf("could not update and mark notification as read: %v", err)

	}
	fmt.Println("DONE")
	return nil
}
func (s *Service) GetAllMes(ctx context.Context, uid2 string, before string, lh09MVP string) ([]Mess, error) {
	fmt.Println(uid2, "shag2")
	var uid string

	if before == "" {
		uid, _ = ctx.Value(KeyAuthUserID).(string)

		fmt.Print(uid)
	} else {
		uid, _ = s.codec().DecodeToString(before)

	}
	clientt := getClient()
	val, err := clientt.Get(ctx, fmt.Sprint(uid)).Result()
	if err != nil {
		fmt.Println(err)
	}
	var usr LoginOutput

	err = json.Unmarshal([]byte(val), &usr)

	if usr.Token != lh09MVP {
		return nil, ErrUnauthenticated
	}
	fmt.Println(uid, "GetAllMess")
	fmt.Println("shag")
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return nil, fmt.Errorf("coudnt:%v", err)
	}
	fmt.Println(uid2)
	defer tx.Rollback()

	cm := make([]Mess, 0, 4)
	query := ` SELECT  messanges_notyfi.id, messages, uid_in, uid_out, users.username, uid_in = $1 AS mine FROM messanges_notyfi INNER JOIN users ON users.id = messanges_notyfi.uid_in WHERE uid_in = $1  ORDER BY created_at LIMIT 15`
	rows, err := tx.QueryContext(ctx, query, uid)
	if err != nil {
		return nil, fmt.Errorf("coudnt:%v", err)
	}
	defer rows.Close()
	for rows.Next() {

		var cms Mess
		if err = rows.Scan(&cms.ID, &cms.Messages, &cms.Retriver, &cms.Sender, &cms.UsersnameR, &cms.Mine); err != nil {
			return nil, fmt.Errorf("sql error:%v", err)
		}

		cm = append(cm, cms)
	}

	return cm, nil

}

func (s *Service) CreateGpMessange(ctx context.Context, gid string, message string, lh09MVP string) (Mess, error) {
	var mes Mess
	//user := "alex"
	fmt.Println(gid)
	fmt.Println(message)
	uid, auth := ctx.Value(KeyAuthUserID).(string)
	if !auth {
		return mes, ErrUnauthenticated
	}
	clientt := getClient()
	val, err := clientt.Get(ctx, fmt.Sprint(uid)).Result()
	if err != nil {
		fmt.Println(err)
	}
	var usr LoginOutput

	err = json.Unmarshal([]byte(val), &usr)

	if usr.Token != lh09MVP {
		return mes, ErrUnauthenticated
	}
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return mes, fmt.Errorf("coudnt:%v", err)
	}
	defer tx.Rollback()
	query := "INSERT INTO messanges_gp ( messages, uid_in, gid) VALUES ($3, $1, $2) RETURNING id "
	if err = tx.QueryRowContext(ctx, query, uid, gid, message).Scan(&mes.ID); err != nil {
		return mes, fmt.Errorf("coudnt insert messanges_noty: %v", err)
	}
	query = "SELECT username FROM users WHERE id=$1"
	if err = tx.QueryRowContext(ctx, query, uid).Scan(&mes.UsersnameR); err != nil {
		return mes, fmt.Errorf("coudnt insert messanges_noty: %v", err)
	}
	fmt.Println(mes.ID)
	mes.UID = uid
	mes.Sender = uid
	mes.Retriver = gid
	mes.Messages = message
	if err != nil {
		return mes, fmt.Errorf("coudnt:%v", err)
	}

	var gg Group
	gg.Messages = message
	gg.GID = gid
	gg.UID = uid
	gg.Sender = uid
	gg.Retriver = gid
	gg.UsersnameR = mes.UsersnameR
	gg.ModCl = "group"
	gg.Type = "message"
	query = ` SELECT uid from  groupU where gid=$1 `
	rows, err := tx.QueryContext(ctx, query, gid)
	if err != nil {
		return mes, fmt.Errorf("error:%v", err)
	}
	fmt.Println("brod1")
	for rows.Next() {
		var cms Group
		if err = rows.Scan(&cms.UID); err != nil {
			return mes, fmt.Errorf("error:%v", err)
		}
		gg.UID = cms.UID
		go s.gpCreated(gg)
	}
	if err = tx.Commit(); err != nil {
		return mes, fmt.Errorf("coudnt create comment: %v ", err)
	}
	return mes, nil
}

func (s *Service) GetAllMesGp(ctx context.Context, gid string, lh09MVP string) ([]Mess, error) {
	uid, auth := ctx.Value(KeyAuthUserID).(string)
	if !auth {
		return nil, ErrUnauthenticated
	}
	fmt.Println(uid, "GetAllMess")
	fmt.Println("shag")
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return nil, fmt.Errorf("coudnt:%v", err)
	}
	clientt := getClient()
	val, err := clientt.Get(ctx, fmt.Sprint(uid)).Result()
	if err != nil {
		fmt.Println(err)
	}
	var usr LoginOutput

	err = json.Unmarshal([]byte(val), &usr)

	if usr.Token != lh09MVP {
		return nil, ErrUnauthenticated
	}
	defer tx.Rollback()

	cm := make([]Mess, 0, 4)
	query := ` SELECT  messanges_gp.id, messages, uid_in, gid, users.username FROM messanges_gp 
	INNER JOIN users ON users.id = messanges_gp.uid_in 
	WHERE gid = $1  ORDER BY created_at LIMIT 15`
	rows, err := tx.QueryContext(ctx, query, gid)
	if err != nil {
		return nil, fmt.Errorf("coudnt:%v", err)
	}
	defer rows.Close()
	for rows.Next() {

		var cms Mess
		if err = rows.Scan(&cms.ID, &cms.Messages, &cms.Retriver, &cms.Sender, &cms.UsersnameR); err != nil {
			return nil, fmt.Errorf("sql error:%v", err)
		}

		cm = append(cm, cms)
	}

	return cm, nil

}
