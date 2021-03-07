package service

import (
	"bytes"
	"context"
	"database/sql"
	"encoding/gob"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"time"
)

type Group struct {
	ID         string
	UID        string
	Theme      string
	Opis       string
	PID        string
	Closer     string
	CreatedAT  string
	Pass       string
	Link       string
	Username   string
	URL        string
	Name       string
	Tittle     string
	Value      string
	Type       string
	UID2       string
	TID        string
	GID        string
	Count      string
	Sender     string
	Retriver   string
	Messages   string
	ModCl      string
	UsersnameR string
	Mine       bool
	Groupim    []Groupim
	IssuedAt   time.Time
	CreatedAt  time.Time
}
type Groupim struct {
	Name string
	URL  string
}
type Gpdfhjzz []Group

func (s *Service) CreateGroup(ctx context.Context, theme string, opis string, postID string, closer string, pass string, out string) (Group, error) {
	var gr Group
	//user := "alex"

	uid, auth := ctx.Value(KeyAuthUserID).(string)
	if !auth {
		return gr, ErrUnauthenticated
	}
	clientt := getClient()
	val, err := clientt.Get(ctx, fmt.Sprint(uid)).Result()
	if err != nil {
		fmt.Println(err)
	}
	var usr LoginOutput

	err = json.Unmarshal([]byte(val), &usr)

	if usr.Token != out {
		return gr, ErrUnauthenticated
	}
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return gr, fmt.Errorf("coudnt begin: %v", err)
	}
	defer tx.Rollback()
	//username := "hi"

	query := "INSERT INTO groups ( user_id, theme, opis, post_id, closer , passwordGpUs) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id "
	if err = tx.QueryRowContext(ctx, query, uid, theme, opis, postID, closer, pass).Scan(&gr.ID); err != nil {
		return gr, fmt.Errorf("coudnt insert groups: %v", err)
	}
	fmt.Println(gr.ID, "gr.ID")
	query = "INSERT INTO groupU ( uid, gid ) VALUES ($1, $2)  "
	if _, err = tx.ExecContext(ctx, query, uid, gr.ID); err != nil {
		return gr, fmt.Errorf("coudnt insert groups: %v", err)
	}
	if err != nil {
		log.Fatal(err)
	}
	gr.UID = uid
	gr.Theme = theme
	gr.Opis = opis
	gr.PID = postID
	gr.Closer = closer
	if err = tx.Commit(); err != nil {
		return gr, fmt.Errorf("coudnt commit create post: %v", err)
	}
	_ = clientt.Del(ctx, "Gpptmm"+uid)
	return gr, nil
}
func (s *Service) GetAllGroup(ctx context.Context, before int64, out string) ([]Group, error) {

	uid, _ := ctx.Value(KeyAuthUserID).(string)

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

	if usr.Token != out {
		return nil, ErrUnauthenticated
	}
	valn, err := clientt.Get(ctx, "Gpptmm"+uid).Result()
	if err != nil {
		fmt.Println(err)
	}
	var cm1 Gpdfhjzz

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
	defer tx.Rollback()
	fmt.Println(uid, "uid")
	cm := make([]Group, 0, 4)
	query, args, err := buildQuery(` SELECT  groups.id, groupU.gid, groups.theme, groups.issued_at, groups.passwordgpus, images.name FROM groupU
	LEFT JOIN groups ON groups.id = groupU.gid 
	LEFT JOIN images ON images.post_id = groups.post_id 
	WHERE  uid = @uid 
	 {{if .before}} AND groups.id < @before {{end}} 
	 ORDER BY groups.issued_at DESC
	LIMIT 8
	`,
		map[string]interface{}{
			"before": before,
			"uid":    uid,
		})
	fmt.Println(query, before, uid)

	if err != nil {
		return nil, fmt.Errorf("coudnt:%v", err)
	}
	rows, err := tx.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("coudnt select posts: %v", err)
	}
	defer rows.Close()
	for rows.Next() {

		var cms Group
		if err = rows.Scan(&cms.ID, &cms.PID, &cms.Theme, &cms.CreatedAT, &cms.Pass, &cms.Name); err != nil {
			return nil, fmt.Errorf("sql error:%v", err)
		}
		cms.URL, _ = getObject("processed/300x300/" + cms.Name)
		cm = append(cm, cms)
	}
	json, err := json.Marshal(cm)
	if err != nil {
		return nil, fmt.Errorf("sql error:%v", err)
	}
	_, err = clientt.Set(ctx, "Gpptmm"+uid, json, 0).Result()

	if err != nil {
		return nil, fmt.Errorf("sql error:%v", err)
	}
	return cm, nil

}
func (s *Service) ShowGp(ctx context.Context, pid, out string) ([]Group, error) {
	fmt.Println(pid, "pidpid")

	uid, errr := ctx.Value(KeyAuthUserID).(string)
	if !errr {
		return nil, fmt.Errorf("coudnter:%v", errr)
	}
	clientt := getClient()
	val, err := clientt.Get(ctx, fmt.Sprint(uid)).Result()
	if err != nil {
		fmt.Println(err)
	}
	var usr LoginOutput

	err = json.Unmarshal([]byte(val), &usr)

	if usr.Token != out {
		return nil, ErrUnauthenticated
	}
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return nil, fmt.Errorf("coudntss:%v", err)
	}

	defer tx.Rollback()

	cm := make([]Group, 0, 4)
	query := ` SELECT  * FROM groups WHERE   id = $1 ORDER BY issued_at LIMIT 1`
	rows, err := tx.QueryContext(ctx, query, pid)
	if err != nil {
		return nil, fmt.Errorf("coudnnn:%v", err)
	}
	defer rows.Close()
	for rows.Next() {

		var cms Group
		if err = rows.Scan(&cms.ID, &cms.Theme, &cms.Opis, &cms.UID, &cms.PID, &cms.Closer, &cms.CreatedAT, &cms.Pass); err != nil {
			return nil, fmt.Errorf("sql error:%v", err)
		}

		cm = append(cm, cms)
	}

	return cm, nil

}
func (s *Service) GpStream(ctx context.Context, before string, GID string) (<-chan Group, error) {

	gg := make(chan Group)

	uid, _ := s.codec().DecodeToString(before)
	fmt.Println(uid, "NotificationStream")
	clientt := getClient()
	val, err := clientt.Get(ctx, fmt.Sprint(uid)).Result()
	if err != nil {
		fmt.Println(err)
	}
	var usr LoginOutput

	err = json.Unmarshal([]byte(val), &usr)

	if usr.Token != before {
		return nil, ErrUnauthenticated
	}
	fmt.Println(ctx, "uids")

	fmt.Println(gg)

	unsub, err := s.pubsub.Sub(commentTopic(uid), func(data []byte) {
		go func(r io.Reader) {
			var g Group

			err := gob.NewDecoder(r).Decode(&g)

			if err != nil {
				log.Printf("could not gob decode comment: %v\n", err)
				return
			}
			fmt.Println(g, "var m Mess")
			gg <- g
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
		fmt.Println("goMessStream", gg)
		close(gg)
	}()
	fmt.Println("MessStreamz", gg)
	return gg, nil

}
func (s *Service) CreateStoryGp(ctx context.Context, gid string, pid string, value string, title string, username string, out string, filename []*multipart.FileHeader) (Com, error) {
	var com Com
	//user := "alex"

	uid, auth := ctx.Value(KeyAuthUserID).(string)
	if !auth {
		return com, ErrUnauthenticated
	}
	clientt := getClient()
	val, err := clientt.Get(ctx, fmt.Sprint(uid)).Result()
	if err != nil {
		fmt.Println(err)
	}
	var usr LoginOutput

	err = json.Unmarshal([]byte(val), &usr)

	if usr.Token != out {
		return com, ErrUnauthenticated
	}
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return com, fmt.Errorf("coudnt:%v", err)
	}
	types := "story"
	defer tx.Rollback()
	//username := "hi"
	modcl := "group"
	fmt.Println(pid, "pidpid")
	query := `INSERT INTO comments (value, title, pid, uid, username, gid ) VALUES ($1, $2,  $3,  $4, $5, $6 ) RETURNING id, created_at`
	if err = s.db.QueryRowContext(ctx, query, value, title, pid, uid, username, gid).Scan(&com.ID, &com.CreatedAt); err != nil {

		return com, fmt.Errorf("error1:%v", err)
	}
	query = `INSERT INTO gpall (value, type, pid, uid, uid2, gid, modcl ) VALUES ($1, $2,  $3,  $4, $4, $5,$6) RETURNING id`
	_, err = tx.ExecContext(ctx, query, title, types, pid, uid, gid, modcl)
	if err != nil {
		return com, fmt.Errorf("error2:%v", err)
	}

	query = `SELECT name FROM avatar WHERE user_id = $1 `
	if err = s.db.QueryRowContext(ctx, query, uid).Scan(&com.Name); err != nil {

		return com, fmt.Errorf("error4:%v", err)
	}
	cmd := make([]Groupim, 0, 4)
	for i, _ := range filename {
		var cmi Groupim
		query := "INSERT INTO imagesgp ( user_id, cid, name ) VALUES ( $1, $2, $3 ) "
		_, err := s.db.ExecContext(ctx, query, uid, com.ID, filename[i].Filename)
		if err != nil {
			return com, fmt.Errorf("coudntrr:%v", err)
		}
		cmi.URL, _ = getObject("processed/300x300/" + filename[i].Filename)
		cmd = append(cmd, cmi)
		fmt.Println(cmd, "cmdcmdcmd")
		com.Groupim = cmd

	}

	if err != nil {
		log.Fatal(err)
	}
	com.Value = value
	com.Tittle = title
	com.Pid = pid
	com.UID = uid

	if err != nil {
		return com, fmt.Errorf("coudnt create comment: %v ", err)
	}

	var gg Group
	gg.Groupim = com.Groupim
	gg.Username = username
	gg.Count = com.Count
	gg.Name = com.Name
	gg.Value = value
	gg.Tittle = title
	gg.PID = pid
	gg.GID = gid
	gg.UID = uid
	gg.ModCl = modcl
	gg.CreatedAt = com.CreatedAt
	gg.Type = "story"
	query = ` SELECT uid from  groupU where gid=$1 `
	rows, err := tx.QueryContext(ctx, query, gid)
	if err != nil {
		return com, fmt.Errorf("errorrs:%v", err)
	}
	fmt.Println("brod1")
	for rows.Next() {
		var cms Group
		if err = rows.Scan(&cms.UID); err != nil {
			return com, fmt.Errorf("errorrr:%v", err)
		}
		gg.UID = cms.UID
		go s.gpCreated(gg)
	}
	if err = tx.Commit(); err != nil {
		return com, fmt.Errorf("coudnt create comment: %v ", err)
	}

	return com, nil
}
func (s *Service) gpCreated(g Group) {

	go s.broadcastGp(g)

}
func (s *Service) GetAllStGp(ctx context.Context, pid int64, out string) ([]Group, error) {
	uid, auth := ctx.Value(KeyAuthUserID).(string)
	if !auth {
		return nil, ErrUnauthenticated
	}
	clientt := getClient()
	val, err := clientt.Get(ctx, fmt.Sprint(uid)).Result()
	if err != nil {
		fmt.Println(err)
	}
	var usr LoginOutput

	err = json.Unmarshal([]byte(val), &usr)

	if usr.Token != out {
		return nil, ErrUnauthenticated
	}
	fmt.Println(pid)
	fmt.Println("GetAllbroadcastComment")
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return nil, fmt.Errorf("coudnt:%v", err)
	}
	defer tx.Rollback()
	cm := make([]Group, 0, 4)

	query := ` SELECT title, comments.id, pid, uid, users.username, avatar.name  
	FROM comments 
	INNER JOIN users ON comments.uid = users.id 
	INNER JOIN avatar ON avatar.user_id = uid 
	 
	WHERE gid = $1 
	ORDER BY created_at DESC 
	LIMIT 4 `
	rows, err := s.db.QueryContext(ctx, query, pid)
	if err != nil {
		return nil, fmt.Errorf("coudntSD:%v", err)
	}

	for rows.Next() {
		var cms Group

		if err = rows.Scan(&cms.Tittle, &cms.ID, &cms.PID, &cms.UID, &cms.Username, &cms.Name); err != nil {
			return nil, fmt.Errorf("sql error:%v", err)
		}
		fmt.Println(cms.ID, "cms.ID")
		quer := ` SELECT name
        FROM imagesgp 
        INNER JOIN comments ON comments.id = imagesgp.cid 
        WHERE imagesgp.cid=$1 
        ORDER BY created_at DESC 
        limit 6 `
		rowz, err := tx.QueryContext(ctx, quer, cms.ID)
		if err != nil {
			return nil, fmt.Errorf("coudntSD:%v", err)
		}
		cmd := make([]Groupim, 0, 4)
		for rowz.Next() {
			var cmi Groupim

			if err = rowz.Scan(&cmi.Name); err != nil {
				return nil, fmt.Errorf("sql error:%v", err)
			}
			fmt.Println(cmi.Name, "cmi.Namecmi.Name")
			cmi.URL, _ = getObject("processed/300x300/" + cmi.Name)
			cmd = append(cmd, cmi)
			fmt.Println(cmd, "cmdcmdcmd")
			cms.Groupim = cmd

		}

		cms.URL, _ = getObject("processed/100x100/" + cms.Name)

		cm = append(cm, cms)
	}

	return cm, nil

}
func (s *Service) ChUg(ctx context.Context, pid, out string) ([]Group, error) {
	fmt.Println(pid, "pidpid")
	var cms Group

	uid, errr := ctx.Value(KeyAuthUserID).(string)
	if !errr {
		return nil, fmt.Errorf("coudnt:%v", errr)
	}
	clientt := getClient()
	val, err := clientt.Get(ctx, fmt.Sprint(uid)).Result()
	if err != nil {
		fmt.Println(err)
	}
	var usr LoginOutput

	err = json.Unmarshal([]byte(val), &usr)

	if usr.Token != out {
		return nil, ErrUnauthenticated
	}
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return nil, fmt.Errorf("coudnt:%v", err)
	}

	defer tx.Rollback()

	cm := make([]Group, 0, 4)
	query := ` SELECT  * FROM groupU WHERE   gid = $1 AND uid=$2`
	err = tx.QueryRowContext(ctx, query, pid, uid).Scan(&cms.ID, &cms.UID, &cms.PID)
	if err == sql.ErrNoRows {
		return nil, ErrUserNoFound
	}
	if err != nil {
		return nil, fmt.Errorf("coudnter:%v", err)
	}

	return cm, nil

}
func (s *Service) RegUsGr(ctx context.Context, gid string, pass string, out string) (Group, error) {
	var cms Group
	uid, auth := ctx.Value(KeyAuthUserID).(string)
	if !auth {
		return cms, ErrUnauthenticated
	}
	clientt := getClient()
	val, err := clientt.Get(ctx, fmt.Sprint(uid)).Result()
	if err != nil {
		fmt.Println(err)
	}
	var usr LoginOutput

	err = json.Unmarshal([]byte(val), &usr)

	if usr.Token != out {
		return cms, ErrUnauthenticated
	}
	fmt.Println("GetAllbroadcastComment")
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return cms, fmt.Errorf("coudnt:%v", err)
	}
	defer tx.Rollback()

	query := ` SELECT * 
	FROM groups 
	WHERE id = $1  AND passwordGpUs = $2
	`
	err = tx.QueryRowContext(ctx, query, gid, pass).Scan(&cms.ID, &cms.Theme, &cms.Opis, &cms.UID, &cms.PID, &cms.Closer, &cms.CreatedAT, &cms.Pass)
	if err == sql.ErrNoRows {
		return cms, ErrUserNoFound
	}
	query = ` INSERT INTO groupU (gid , uid) VALUES ($1, $2)`
	_, err = tx.ExecContext(ctx, query, gid, uid)
	if err != nil {
		return cms, ErrUserNoFound
	}
	if err != nil {
		return cms, fmt.Errorf("coudnt:%v", err)
	}
	if err = tx.Commit(); err != nil {
		return cms, fmt.Errorf("coudnt commit create post: %v", err)
	}
	return cms, nil

}
func (s *Service) ListofUser(ctx context.Context, pid, out string) ([]Group, error) {
	fmt.Println(pid, "pidpid")

	uid, errr := ctx.Value(KeyAuthUserID).(string)
	if !errr {
		return nil, fmt.Errorf("coudnt:%v", errr)
	}
	clientt := getClient()
	val, err := clientt.Get(ctx, fmt.Sprint(uid)).Result()
	if err != nil {
		fmt.Println(err)
	}
	var usr LoginOutput

	err = json.Unmarshal([]byte(val), &usr)

	if usr.Token != out {
		return nil, ErrUnauthenticated
	}
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return nil, fmt.Errorf("coudnt:%v", err)
	}

	defer tx.Rollback()

	cm := make([]Group, 0, 4)
	query := ` SELECT groupU.id, uid, gid, users.username, avatar.name FROM groupU INNER JOIN users ON groupU.uid = users.id INNER JOIN avatar ON avatar.user_id = groupU.uid WHERE gid = $1   `
	rows, err := tx.QueryContext(ctx, query, pid)
	if err != nil {
		return nil, fmt.Errorf("coudnt:%v", err)
	}
	for rows.Next() {
		var cms Group
		if err = rows.Scan(&cms.ID, &cms.UID, &cms.PID, &cms.Username, &cms.Link); err != nil {
			return nil, fmt.Errorf("sql error:%v", err)
		}
		cms.URL, _ = getObject("processed/100x100/" + cms.Link)
		cm = append(cm, cms)
	}

	return cm, nil

}

func (s *Service) VidGp(ctx context.Context, gid string, value string, out string) (Group, error) {
	var cms Group
	//user := "alex"
	types := "vidjet"
	uid, auth := ctx.Value(KeyAuthUserID).(string)
	if !auth {
		return cms, ErrUnauthenticated
	}
	clientt := getClient()
	val, err := clientt.Get(ctx, fmt.Sprint(uid)).Result()
	if err != nil {
		fmt.Println(err)
	}
	var usr LoginOutput

	err = json.Unmarshal([]byte(val), &usr)

	if usr.Token != out {
		return cms, ErrUnauthenticated
	}
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return cms, fmt.Errorf("coudnt begin: %v", err)
	}
	defer tx.Rollback()
	//username := "hi"
	modcl := "group"
	query := ` SELECT  * FROM groupU WHERE   gid = $1 AND uid=$2`
	err = tx.QueryRowContext(ctx, query, gid, uid).Scan(&cms.ID, &cms.UID, &cms.PID)
	if err == sql.ErrNoRows {
		return cms, ErrUserNoFound
	}

	query = "INSERT INTO vidjet ( uid, gid, link ) VALUES ($1, $2, $3) "
	if _, err = s.db.ExecContext(ctx, query, uid, gid, value); err != nil {
		return cms, fmt.Errorf("coudnt insert groups: %v", err)
	}
	query = `INSERT INTO gpall (value, type, uid, uid2, gid, modcl ) VALUES ($1, $2,  $3,  $3, $4, $5 ) RETURNING id`
	_, err = tx.ExecContext(ctx, query, value, types, uid, gid, modcl)
	if err != nil {
		return cms, fmt.Errorf("error:%v", err)
	}
	if err != nil {
		log.Fatal(err)
	}

	cms.Link = value
	var gg Group
	gg.Type = "vidjet"
	gg.UID = cms.UID
	gg.Link = value
	gg.GID = gid
	gg.ModCl = modcl
	query = ` SELECT uid from  groupU where gid=$1 `
	rows, err := tx.QueryContext(ctx, query, gid)
	if err != nil {
		return cms, fmt.Errorf("coudnt create comment: %v ", err)
	}
	fmt.Println("brod1")
	for rows.Next() {
		var cms Group
		if err = rows.Scan(&cms.UID); err != nil {
			return cms, fmt.Errorf("coudnt create comment: %v ", err)
		}
		gg.UID = cms.UID
		go s.gpCreated(gg)
	}
	if err = tx.Commit(); err != nil {
		return cms, fmt.Errorf("coudnt create comment: %v ", err)
	}
	return cms, nil
}
func (s *Service) GetVidGp(ctx context.Context, gid string, before int64, out string) ([]Group, error) {
	var cms Group
	//user := "alex"

	fmt.Println("GetVidGp")
	uid, auth := ctx.Value(KeyAuthUserID).(string)
	if !auth {
		return nil, ErrUnauthenticated
	}
	clientt := getClient()
	val, err := clientt.Get(ctx, fmt.Sprint(uid)).Result()
	if err != nil {
		fmt.Println(err)
	}
	var usr LoginOutput

	err = json.Unmarshal([]byte(val), &usr)

	if usr.Token != out {
		return nil, ErrUnauthenticated
	}
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return nil, fmt.Errorf("coudnt begin: %v", err)
	}
	defer tx.Rollback()
	//username := "hi"

	query := ` SELECT  * FROM groupU WHERE   gid = $1 AND uid=$2`
	err = tx.QueryRowContext(ctx, query, gid, uid).Scan(&cms.ID, &cms.UID, &cms.PID)

	if err == sql.ErrNoRows {
		return nil, ErrUserNoFound
	}
	if err != nil {
		log.Fatal(err)
	}

	cm := make([]Group, 0, 4)
	args := []interface{}{gid}
	if before != 0 {
		query = "SELECT  * FROM vidjet WHERE gid = $1 and id < $2 ORDER BY issuedAt DESC LIMIT 6 "
		args = append(args, before)
	} else {
		query = "SELECT  * FROM vidjet WHERE gid = $1  ORDER BY issuedAt DESC LIMIT 6"

	}
	rows, err := tx.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("coudnt:%v", err)
	}
	for rows.Next() {
		var cms Group
		if err = rows.Scan(&cms.ID, &cms.UID, &cms.Link, &cms.PID, &cms.IssuedAt); err != nil {
			return nil, fmt.Errorf("sql error:%v", err)
		}
		cm = append(cm, cms)
	}

	return cm, nil
}
