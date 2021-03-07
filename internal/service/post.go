package service

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"mime/multipart"
	"strconv"
	"strings"
	"time"

	"github.com/sanity-io/litter"
)

type Post struct {
	Tags       string    `json:"lk_j21_dv_i220"`
	Raty       float64   `json:"lk_j21_dv_i221"`
	Counter    float64   `json:"lk_j21_dv_i222"`
	ID         string    `json:"lk_j21_dv_i223"`
	TID        string    `json:"lk_j21_dv_i224"`
	GID        string    `json:"lk_j21_dv_i225"`
	UserId     string    `json:"lk_j21_dv_i226"`
	Content    string    `json:"lk_j21_dv_i227"`
	CreatedAt  time.Time `json:"lk_j21_dv_i228"`
	LikesCount int       `json:"lk_j21_dv_i229"`
	SpoilerOf  *string   `json:"lk_j21_dv_i210"`
	NSFW       bool      `json:"lk_j21_dv_i211"`
	User       *User
	Mine       bool           `json:"lk_j21_dv_i212"`
	Liked      bool           `json:"lk_j21_dv_i213"`
	ComCount   string         `json:"lk_j21_dv_i214"`
	Username   string         `json:"lk_j21_dv_i215"`
	Name       string         `json:"lk_j21_dv_i216"`
	URL        string         `json:"lk_j21_dv_i217"`
	Sub        bool           `json:"lk_j21_dv_i218"`
	Imname     string         `json:"lk_j21_dv_i219"`
	Imsrc      string         `json:"lk_j21_dv_i290"`
	Amount     sql.NullInt64  `json:"lk_j21_dv_i291"`
	Tittle     string         `json:"lk_j21_dv_i292"`
	Tag        sql.NullString `json:"lk_j21_dv_i293"`
	Opit       string         `json:"lk_j21_dv_i294"`
	Typework   bool           `json:"lk_j21_dv_i295"`
	Projtm     bool           `json:"lk_j21_dv_i296"`
	Hourtp     bool           `json:"lk_j21_dv_i297"`
	Col        int            `json:"lk_j21_dv_i298"`
	Zap        bool           `json:"lk_j21_dv_i299"`
}

type Memes struct {
	Mime  bool `json:"mm_34_pp_s243"`
	Inter int  `json:"ms_56MMgjk"`
}
type ToggleLikeOutput struct {
	Liked      bool `json:"mm_65_dv_i244"`
	LikesCount int  `json:"mm_65_dv_i245"`
}
type Filters struct {
	Lvm string `json:"mm_65_dv_i245"`
}
type Postzz []Post

func (s *Service) Posts(ctx context.Context, username string, last int, before int64) ([]Post, error) {
	username = strings.TrimSpace(username)
	if !rxUsername.MatchString(username) {
		return nil, ErrInvalidUsername

	}
	uid, auth := ctx.Value(KeyAuthUserID).(string)
	if !auth {
		return nil, ErrUnauthenticated
	}

	fmt.Println(uid, "uider")
	last = normalizePageSize(last)
	query, args, err := buildQuery(` SELECT posts.id, content, spoiler_of, nsfw, likes_count, created_at, images.name, users.username, comments_count  
	{{if .auth}}
	, posts.user_id = @uid AS mine
	, likes.user_id IS NOT NULL AS liked
	{{end}}
	FROM posts 
	LEFT JOIN images ON images.post_id = posts.id AND posts.id = images.post_id 
	{{if .auth}}
	LEFT JOIN users ON users.id = posts.user_id AND posts.user_id = users.id   
	 LEFT JOIN post_likes AS likes
	  ON likes.user_id = @uid AND likes.post_id = posts.id
	{{end}}
	 
	 WHERE NOT deleted = true AND posts.user_id = ( SELECT users.id FROM users WHERE username = @username 
	{{if .before}} AND posts.id < @before {{end}})
	ORDER BY created_at DESC
    LIMIT @last
	`,
		map[string]interface{}{
			"before":   before,
			"auth":     auth,
			"uid":      uid,
			"username": username,
			"last":     last,
		})
	fmt.Println(uid, "uider2")
	if err != nil {
		return nil, fmt.Errorf("coudnt select posts: %v", err)
	}
	tx, err := s.db.BeginTx(ctx, nil)

	if err != nil {
		return nil, fmt.Errorf("coudnt begin: %v", err)
	}
	defer tx.Rollback()
	rows, err := tx.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("coudnt select posts: %v", err)
	}
	fmt.Println(uid, "uider3")
	defer rows.Close()
	pp := make([]Post, 0, last)
	for rows.Next() {
		var p Post
		dest := []interface{}{&p.ID, &p.Content, &p.SpoilerOf, &p.NSFW, &p.LikesCount, &p.CreatedAt, &p.Name, &p.Username, &p.ComCount}
		if auth {
			dest = append(dest, &p.Mine, &p.Liked)

		}
		if err = rows.Scan(dest...); err != nil {
			return nil, fmt.Errorf("coudt: %v", err)
		}
		p.URL, err = getObject("processed/300x300/" + p.Name)

		pp = append(pp, p)
		if err = rows.Err(); err != nil {
			return nil, fmt.Errorf("coudnt:%v", err)
		}

	}
	fmt.Println(pp, "uider5")
	return pp, nil
}
func (s *Service) Post(ctx context.Context, pid int64, last int, before int64) ([]Post, error) {

	tx, err := s.db.BeginTx(ctx, nil)
	uid, auth := ctx.Value(KeyAuthUserID).(string)
	if !auth {
		return nil, ErrUnauthenticated
	}
	client := getClient()
	val, err := client.Get(ctx, "Pt34a7e"+fmt.Sprint(pid)).Result()
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(val, "val")
	var cm Postzz
	fmt.Println(cm, "cmcmcmcmcm")

	err = json.Unmarshal([]byte(val), &cm)
	if err != nil {
		fmt.Println(err)
	}

	fmt.Println(cm, "jjkljlkjkljlkjlkl")
	if val == "" {
		last = normalizePageSize(last)
		fmt.Println(before)
		fmt.Println("okok")

		defer tx.Rollback()
		cm := make([]Post, 0, last)

		query := ` SELECT posts.id, posts.user_id, content, created_at, likes_count, posts.user_id, images.name, users.username, comments_count, amount, usopit, timeproj, worktp, hourtp, title,  tag
	FROM posts  
	LEFT JOIN users ON users.id = posts.user_id AND posts.user_id = users.id   
	LEFT JOIN images ON images.post_id = posts.id AND posts.id = images.post_id 
	WHERE posts.id = $2 AND NOT deleted = true
	ORDER BY created_at DESC
	LIMIT $1 
	`
		rows, err := s.db.QueryContext(ctx, query, last, pid)
		if err != nil {
			return nil, fmt.Errorf("sql error:%v", err)
		}
		for rows.Next() {
			var cms Post
			if err != nil {
				return nil, fmt.Errorf("sql error:%v", err)
			}
			err = rows.Scan(&cms.ID, &cms.UserId, &cms.Content, &cms.CreatedAt, &cms.LikesCount, &cms.SpoilerOf, &cms.Name, &cms.Username, &cms.ComCount, &cms.Amount, &cms.Opit, &cms.Projtm, &cms.Typework, &cms.Hourtp, &cms.Tittle, &cms.Tag)

			if err != nil {
				return nil, fmt.Errorf("sql error:%v", err)
			}
			query = ` SELECT COUNT(*) FROM comments WHERE pid = $1 and uid=$2 `
			if err = tx.QueryRowContext(ctx, query, pid, uid).Scan(&cms.Col); err != nil {
				return cm, fmt.Errorf("coudnt insert timeline: %v", err)
			}
			cms.Zap = false
			if cms.Col > 0 {
				cms.Zap = true
			} else {
				cms.Zap = false
			}
			if cms.UserId == uid {
				cms.Mine = true
			}
			fmt.Println("vvnvnbvnbhhhhhhhhhhvn")
			cms.URL, err = getObject("processed/1000x1000/" + cms.Name)
			cm = append(cm, cms)

		}
		json, err := json.Marshal(cm)
		if err != nil {
			return cm, fmt.Errorf("coudnt commit create post: %v", err)
		}
		_, err = client.Set(ctx, "Pt34a7e"+fmt.Sprintf("%v", pid), json, 12*time.Hour).Result()
		if err != nil {
			return cm, fmt.Errorf("coudnt commit create post: %v", err)
		}
		fmt.Println(cm, "cmdfgdgfdgf")
		return cm, nil
	}
	cm[0].Mine = false
	if cm[0].UserId == uid {
		cm[0].Mine = true
	}

	return cm, nil
}
func (s *Service) CreatePost(ctx context.Context, content string, age int, access int, title string, spoilerOf *string, nsfw bool, tag string, amount string, acpt string, worktp string, hourtp string, lh09MVP string) (TimelineItem, error) {
	var ti TimelineItem
	var f Filters
	i, err := strconv.Atoi(amount)
	fmt.Println(i, "amountamounter")
	uid, ok := ctx.Value(KeyAuthUserID).(string)
	if !ok {
		return ti, ErrUnauthenticated
	}
	clientt := getClient()
	val, err := clientt.Get(ctx, fmt.Sprint(uid)).Result()
	if err != nil {
		fmt.Println(err)
	}
	var usr LoginOutput
	fmt.Println(123, "576576")
	err = json.Unmarshal([]byte(val), &usr)

	if usr.Token != lh09MVP {
		return ti, ErrUnauthenticated
	}

	var n int
	for {
		var keys []string
		keys, cursor, err = clientt.Scan(ctx, cursor, "Pt58a*", 10).Result()
		fmt.Println(123, "576578")

		if err != nil {
			fmt.Println(err, "errors")
			break
		}
		n += len(keys)
		if cursor == 0 {
			break
		}
		for i := 0; i < len(keys); i++ {
			_ = clientt.Del(ctx, keys[i])
		}

	}

	content = strings.TrimSpace(content)
	if content == "" || len([]rune(content)) > 10080 {
		return ti, ErrPostLenth
	}
	if spoilerOf != nil {
		*spoilerOf = strings.TrimSpace(*spoilerOf)
		if *spoilerOf == "" || len([]rune(*spoilerOf)) > 64 {
			return ti, ErrInvalidSpoiler
		}

	}

	tx, err := s.db.BeginTx(ctx, nil)

	if err != nil {
		return ti, fmt.Errorf("coudnt begin: %v", err)
	}
	defer tx.Rollback()
	acpt0 := false
	if acpt == "0" {
		acpt0 = false
	}
	if acpt == "1" {
		acpt0 = true
	}
	wp := false
	if worktp == "0" {
		wp = false
	}
	if worktp == "1" {
		wp = true
	}
	hp := false
	if hourtp == "0" {
		hp = false
	}
	if hourtp == "1" {
		hp = true
	}
	fmt.Println(acpt, "acpt0")
	if age == 0 {
		f.Lvm = "new"
	} else if age == 1 {
		f.Lvm = "medium"
	} else if age == 2 {
		f.Lvm = "expert"
	}
	var gr Group
	closer := "open"
	fmt.Println(tag, "gjhgjhgj")

	query := "INSERT INTO posts (user_id, content, spoiler_of, nsfw, age, access, title, tag, amount, usopit, timeproj, worktp, hourtp) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9,$10, $11, $12, $13) " +
		"RETURNING id, created_at, likes_count, comments_count "
	if err = s.db.QueryRowContext(ctx, query, uid, content, spoilerOf, nsfw, age, access, title, tag, i, f.Lvm, acpt0, wp, hp).Scan(&ti.Post.ID, &ti.Post.CreatedAt, &ti.Post.LikesCount, &ti.Post.ComCount); err != nil {
		return ti, fmt.Errorf("coudnt insert post:%v", err)
	}
	//ti.Post.Amount = amount
	ti.Post.Opit = acpt
	ti.Post.Tittle = title
	ti.Post.UserId = uid
	ti.Post.Content = content
	ti.Post.SpoilerOf = spoilerOf
	ti.Post.NSFW = nsfw
	ti.Post.Mine = true
	k := strings.Split(tag, ",")
	fmt.Println(k, "kk")
	for i := 0; i < len(k); i++ {
		query = "INSERT INTO tagss (tag, pid, uid) VALUES ($1, $2, $3) ON CONFLICT (tag) DO UPDATE SET tag=$1 RETURNING id"
		if err = s.db.QueryRowContext(ctx, query, k[i], ti.Post.ID, uid).Scan(&gr.TID); err != nil {
			return ti, fmt.Errorf("coudnt insert postss:%v", err)
		}
		query = "INSERT INTO tags_relation ( tid, pid) VALUES ($1, $2) "
		if _, err = s.db.ExecContext(ctx, query, gr.TID, ti.Post.ID); err != nil {
			return ti, fmt.Errorf("coudnt insert postt:%v", err)
		}
	}
	query = "INSERT INTO images ( user_id, post_id, name ) VALUES ( $1, $2, 'errorimg.jpg' ) ON CONFLICT (post_id) DO NOTHING"
	_, err = s.db.ExecContext(ctx, query, uid, ti.Post.ID)
	if err != nil {
		return ti, fmt.Errorf("coudnt insert postt:%v", err)
	}
	query = "INSERT INTO groups ( user_id, theme, opis, post_id, closer) VALUES ($1, $2, $3, $4, $5) RETURNING id "
	if err = s.db.QueryRowContext(ctx, query, uid, title, content, ti.Post.ID, closer).Scan(&gr.ID); err != nil {
		return ti, fmt.Errorf("coudnt insert groups: %v", err)
	}
	fmt.Println(gr.ID, "gr.ID")
	query = "INSERT INTO groupU ( uid, gid ) VALUES ($1, $2)  "
	if _, err = tx.ExecContext(ctx, query, uid, gr.ID); err != nil {
		return ti, fmt.Errorf("coudnt insert groupz: %v", err)
	}

	query = "INSERT INTO post_subscriptions (user_id, post_id) VALUES ($1, $2) "
	if _, err = tx.ExecContext(ctx, query, uid, ti.Post.ID); err != nil {
		return ti, fmt.Errorf("coudnt insert timeline: %v", err)
	}
	ti.Post.Sub = true
	query = "INSERT INTO timeline(user_id, post_id) VALUES ($1, $2) RETURNING id"
	if err = tx.QueryRowContext(ctx, query, uid, ti.Post.ID).Scan(&ti.ID); err != nil {
		return ti, fmt.Errorf("coudnt insert timeline: %v", err)
	}
	ti.UserID = uid
	ti.PostID = ti.Post.ID
	query = "INSERT INTO tags (tag) VALUES ($1)"
	if _, err = tx.ExecContext(ctx, query, tag); err != nil {
		return ti, fmt.Errorf("coudnt insert timeline: %v", err)
	}
	fmt.Println("shag1")
	if err = tx.Commit(); err != nil {
		return ti, fmt.Errorf("coudnt commit create post: %v", err)
	}
	fmt.Println("shag2")
	go func(p Post) {

		u, err := s.userById(context.Background(), p.UserId)
		fmt.Println("shag3")
		if err != nil {
			log.Printf("coudnt get post user: %v", err)
			return
		}
		fmt.Println("shag5")
		p.User = &u
		p.Mine = false
		p.Sub = false
		tt, err := s.FanoutPost(p)

		if err != nil {
			log.Printf("coudnt fannot post :%v", err)
			return
		}
		for _, ti = range tt {
			log.Println(litter.Sdump(ti))
		}
		fmt.Println("shag4")
	}(ti.Post)
	_ = clientt.Del(ctx, "Gpptmm"+uid)
	if err != nil {
		return ti, fmt.Errorf("coudnt commit create post: %v", err)
	}

	return ti, nil
}

func (s *Service) UPPost(ctx context.Context, content string, age int, access int, title string, spoilerOf *string, nsfw bool, tag string, amount string, acpt string, worktp string, hourtp string, pid int64, lh09MVP string) (TimelineItem, error) {
	var ti TimelineItem
	var f Filters
	i, err := strconv.Atoi(amount)
	fmt.Println(i, "amountamounter")
	uid, ok := ctx.Value(KeyAuthUserID).(string)
	if !ok {
		return ti, ErrUnauthenticated
	}

	clientt := getClient()
	val, err := clientt.Get(ctx, fmt.Sprint(uid)).Result()
	if err != nil {
		fmt.Println(err)
	}
	var usr LoginOutput
	fmt.Println(123, "576576")
	err = json.Unmarshal([]byte(val), &usr)

	if usr.Token != lh09MVP {
		return ti, ErrUnauthenticated
	}

	var n int
	for {
		var keys []string
		keys, cursor, err = clientt.Scan(ctx, cursor, "Pt58a*", 10).Result()
		fmt.Println(123, "576578")

		if err != nil {
			fmt.Println(err, "errors")
			break
		}
		n += len(keys)
		if cursor == 0 {
			break
		}
		for i := 0; i < len(keys); i++ {
			_ = clientt.Del(ctx, keys[i])
		}

	}
	_ = clientt.Del(ctx, "Pt34a7e"+fmt.Sprintf("%v", pid))

	content = strings.TrimSpace(content)
	if content == "" || len([]rune(content)) > 10080 {
		return ti, ErrPostLenth
	}
	if spoilerOf != nil {
		*spoilerOf = strings.TrimSpace(*spoilerOf)
		if *spoilerOf == "" || len([]rune(*spoilerOf)) > 64 {
			return ti, ErrInvalidSpoiler
		}

	}

	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return ti, fmt.Errorf("coudnt begin: %v", err)
	}

	acpt0 := false
	if acpt == "0" {
		acpt0 = false
	}
	if acpt == "1" {
		acpt0 = true
	}
	wp := false
	if worktp == "0" {
		wp = false
	}
	if worktp == "1" {
		wp = true
	}
	hp := false
	if hourtp == "0" {
		hp = false
	}
	if hourtp == "1" {
		hp = true
	}
	fmt.Println(acpt, "acpt0")
	if age == 0 {
		f.Lvm = "new"
	} else if age == 1 {
		f.Lvm = "medium"
	} else if age == 2 {
		f.Lvm = "expert"
	}
	fmt.Println(uid, pid)
	defer tx.Rollback()

	query := "UPDATE posts SET  content=$2, spoiler_of=$3, nsfw=$4, age=$5, access=$6, title=$7, tag=$8, amount=$9, usopit=$10, timeproj=$11, worktp=$12, hourtp =$13 WHERE user_id=$1 AND id=$14"
	if _, err := tx.ExecContext(ctx, query, uid, content, spoilerOf, nsfw, age, access, title, tag, i, f.Lvm, acpt0, wp, hp, pid); err != nil {
		return ti, fmt.Errorf("coudnt insert post:%v", err)
	}
	query = "UPDATE groups SET  theme=$1 , opis=$2  WHERE post_id = $3 AND user_id=$4 "
	if _, err = tx.ExecContext(ctx, query, title, content, pid, uid); err != nil {
		return ti, fmt.Errorf("coudnt insert groups: %v", err)
	}
	ti.Post.UserId = uid
	ti.Post.Content = content
	ti.Post.SpoilerOf = spoilerOf
	ti.Post.NSFW = nsfw
	ti.Post.Mine = true

	ti.Post.Sub = true
	ti.UserID = uid
	ti.PostID = ti.Post.ID
	query = "INSERT INTO tags (tag) VALUES ($1)"
	if _, err = tx.ExecContext(ctx, query, tag); err != nil {
		return ti, fmt.Errorf("coudnt insert timeline: %v", err)
	}
	if err = tx.Commit(); err != nil {
		return ti, fmt.Errorf("coudnt commit create post: %v", err)
	}
	return ti, nil
}

func (s *Service) FanoutPost(p Post) ([]TimelineItem, error) {
	query := "INSERT INTO timeline (user_id, post_id) " +
		"SELECT follwer_id, $1 FROM follows WHERE follwee_id = $2 " +
		"RETURNING id, user_id"
	rows, err := s.db.Query(query, p.ID, p.UserId)
	if err != nil {
		return nil, fmt.Errorf("couldnt insert timeline: %v", err)
	}
	defer rows.Close()
	tt := []TimelineItem{}
	for rows.Next() {
		var ti TimelineItem
		if err = rows.Scan(&ti.ID, &ti.UserID); err != nil {
			return nil, fmt.Errorf("coudnt timeline item: %v", err)
		}
		ti.PostID = p.ID
		ti.Post = p
		tt = append(tt, ti)
	}
	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("coudnt iterate timeline rows: %v", err)

	}
	return tt, nil
}

func (s *Service) ToggleLikes(ctx context.Context, postID int64) (ToggleLikeOutput, error) {
	var out ToggleLikeOutput
	uid, ok := ctx.Value(KeyAuthUserID).(string)
	if !ok {
		return out, ErrUnauthenticated
	}
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return out, fmt.Errorf("coudnt:%v", err)
	}
	defer tx.Rollback()
	query := `SELECT EXISTS(
		SELECT 1 FROM post_likes WHERE user_id = $1 AND post_id = $2
	)`
	if err = tx.QueryRowContext(ctx, query, uid, postID).Scan(&out.Liked); err != nil {
		return out, fmt.Errorf("coudnt:%v", err)
	}
	if out.Liked {
		query = "DELETE FROM post_likes WHERE user_id=$1 AND post_id = $2"
		if _, err = tx.ExecContext(ctx, query, uid, postID); err != nil {
			return out, fmt.Errorf("coudnt post like: %v", err)
		}
		query = "UPDATE posts SET likes_count = likes_count - 1 WHERE id = $1 RETURNING likes_count"
		if err = tx.QueryRowContext(ctx, query, postID).Scan(&out.LikesCount); err != nil {
			return out, fmt.Errorf("coudnt post update and decremate post : %v", err)
		}
	} else {
		query = "INSERT INTO post_likes (user_id, post_id) VALUES ($1, $2)"
		_, err = tx.ExecContext(ctx, query, uid, postID)

		if isUniquePostViolation(err) {
			return out, ErrPostLike
		}
		if err != nil {
			return out, fmt.Errorf("coudnt insert post like:%v", err)
		}
		query = "UPDATE posts SET likes_count = likes_count + 1 WHERE id = $1 RETURNING likes_count"
		if err = tx.QueryRowContext(ctx, query, postID).Scan(&out.LikesCount); err != nil {
			return out, fmt.Errorf("coudnt post update and decremate post : %v", err)

		}
	}
	if err = tx.Commit(); err != nil {
		return out, fmt.Errorf("coudnt commit:%v", err)
	}
	out.Liked = !out.Liked
	return out, nil
}
func (s *Service) ToggleRating(ctx context.Context, uid2 int64, raty float64, content string) (ToggleLikeOutput, error) {
	var out ToggleLikeOutput
	uid, ok := ctx.Value(KeyAuthUserID).(string)
	if !ok {
		return out, ErrUnauthenticated
	}
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return out, fmt.Errorf("coudnt:%v", err)
	}
	defer tx.Rollback()

	query := `SELECT EXISTS( SELECT 1 FROM user_rating WHERE user_id = $1 AND user_id2 = $2)`

	if err = tx.QueryRowContext(ctx, query, uid, uid2).Scan(&out.Liked); err != nil {
		return out, fmt.Errorf("coudnt:%v", err)
	}
	if !out.Liked {
		query = "INSERT INTO user_rating (user_id, user_id2) VALUES ($1, $2)"
		_, err = tx.ExecContext(ctx, query, uid, uid2)

		if err != nil {
			return out, fmt.Errorf("coudnt insert post like:%v", err)
		}
	}

	query = `SELECT raty, counter FROM users WHERE id=$1`
	var p Post
	if err = tx.QueryRowContext(ctx, query, uid2).Scan(&p.Raty, &p.Counter); err != nil {
		return out, fmt.Errorf("coudnt:%v", err)
	}

	var z = (p.Raty + raty) / (p.Counter + 1)
	fmt.Println(z, "raty")
	query = "UPDATE users SET counter = counter + 1, raty=$2  WHERE id = $1 RETURNING raty"
	if err = tx.QueryRowContext(ctx, query, uid2, z).Scan(&p.Raty); err != nil {
		return out, fmt.Errorf("coudnt post update and decremate post : %v", err)

	}
	r := int(raty)
	query = "INSERT INTO otzyv (uid, uid2, rating, value) VALUES ($1, $2, $3, $4)"
	_, err = tx.ExecContext(ctx, query, uid, uid2, r, content)

	if err != nil {
		return out, fmt.Errorf("coudnt insert post like:%v", err)
	}

	if err = tx.Commit(); err != nil {
		return out, fmt.Errorf("coudnt commit:%v", err)
	}
	out.Liked = !out.Liked
	return out, nil
}

func (s *Service) Timeline(ctx context.Context, last int, before int64) ([]Post, error) {
	tx, err := s.db.BeginTx(ctx, nil)
	uid, _ := ctx.Value(KeyAuthUserID).(string)
	fmt.Println(uid, "uidkjljkljlkjkljlk")
	last = normalizePageSize(last)
	fmt.Println(before)
	if err != nil {
		return nil, fmt.Errorf("coudnt:%v", err)
	}
	defer tx.Rollback()
	cm := make([]Post, 0, last)
	query := ` SELECT posts.id, user_id, content, created_at, likes_count, users.username
	FROM posts 

	INNER JOIN users ON posts.user_id = users.id 
	WHERE  posts.id < $2 AND posts.user_id =$3
	ORDER BY created_at DESC
	LIMIT $1 
	`
	rows, err := tx.QueryContext(ctx, query, last, before, uid)
	for rows.Next() {
		var cms Post

		err = rows.Scan(&cms.ID, &cms.UserId, &cms.Content, &cms.CreatedAt, &cms.LikesCount, &cms.Username)
		if err != nil {
			return nil, fmt.Errorf("sql error:%v", err)
		}
		fmt.Println("vvnvnbvnbhhhhhhhhhhvn")

		cm = append(cm, cms)
	}
	fmt.Println("success")
	return cm, nil

}
func (s *Service) UploadPost(ctx context.Context, filename string, pid string) (string, error) {
	fmt.Println(filename, "method")

	uid, _ := ctx.Value(KeyAuthUserID).(string)
	fmt.Println(uid)
	fmt.Println(filename)
	fmt.Println(pid)

	fmt.Println("method 2")
	query := "INSERT INTO images ( user_id, post_id, name ) VALUES ( $1, $2, $3 ) ON CONFLICT (post_id) DO UPDATE SET name=$3"
	_, err := s.db.ExecContext(ctx, query, uid, pid, filename)
	if err != nil {
		return "", fmt.Errorf("coudntrr:%v", err)
	}
	return "", nil

}
func (s *Service) UploadPostMulti(ctx context.Context, filename []*multipart.FileHeader, gid string) (string, error) {
	fmt.Println(filename, "method")

	uid, _ := ctx.Value(KeyAuthUserID).(string)
	fmt.Println(uid)
	fmt.Println(filename)
	fmt.Println(gid)

	fmt.Println("method 2")
	for i, _ := range filename {

		query := "INSERT INTO imagesgp ( user_id, cid, name ) VALUES ( $1, $2, $3 ) "
		_, err := s.db.ExecContext(ctx, query, uid, gid, filename[i].Filename)
		if err != nil {
			return "", fmt.Errorf("coudntrr:%v", err)
		}
	}
	return "", nil

}

var keys []string
var cursor uint64

func (s *Service) GetAllPost(ctx context.Context, before int64, last string, search string, prb string, lvn bool, lvm bool, lve bool, pto bool, pta bool, tps bool, hps bool, butt int, bl bool, typer bool, recc bool) ([]Post, error) {
	uid, _ := ctx.Value(KeyAuthUserID).(string)
	fmt.Println(tps, hps, search, "search")
	i, err := strconv.Atoi(prb)
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return nil, fmt.Errorf("coudnt:%v", err)
	}
	fmt.Println(butt, "butbut")
	c := ""
	if butt <= 1 {
		c = "Pt58a"
	}
	if butt >= 2 {
		c = "Fl5t8a"
	}
	if search == "" {
		c = ""
	}
	client := getClient()
	val, err := client.Get(ctx, c+fmt.Sprint(before)).Result()
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(val, "val")
	var cm1 Postzz

	if err != nil {
		// handle error
	}
	err = json.Unmarshal([]byte(val), &cm1)

	if err != nil {
		fmt.Println("coudnt:%v", err)
	}

	if val != "" && search == "" {
		fmt.Println(cm1, "valvalval")
		return cm1, nil
	}

	defer tx.Rollback()
	args := []interface{}{last, i}
	lvn1 := "falser"
	lvm1 := "falser"
	lve1 := "falser"
	tm1 := false
	tm2 := false
	tm3 := false

	lve4 := ""

	if bl == true {
		tm1 = false

	} else if butt == 2 {
		tm1 = false
		tm2 = true
	} else {
		tm1 = true
		tm2 = false
		tm3 = false
	}

	if lvn == true {
		lvn1 = "new"
	}
	if lvm == true {
		lvm1 = "medium"
	}
	if lve == true {
		lve1 = "expert"
	}
	all := ""
	alls := ""
	wpt := ""
	hpt := ""
	if lvm == true || lvn == true || lve == true {
		all = "m"
	}
	if tps == true {
		wpt = "m"
	}
	if hps == true {
		hpt = "m"
	}
	if pta == true {
		alls = "m"
	}
	if recc == true {
		bl = false
		tm1 = false
	}
	fmt.Println(tm1, bl, recc, "recc")
	cm := make([]Post, 0, 4)
	query, args, err := buildQuery(`
	SELECT  timeline.id, posts.id, posts.user_id, content, spoiler_of, likes_count, comments_count, created_at, users.username, avatar.name, images.name, amount,  title, tag   
   FROM posts 
   INNER JOIN users ON posts.user_id = users.id 
   INNER JOIN timeline ON timeline.post_id = posts.id
   INNER JOIN avatar ON avatar.user_id = posts.user_id 
   LEFT JOIN images ON images.post_id = posts.id AND posts.id = images.post_id 
   WHERE timeline.user_id = posts.user_id AND NOT deleted = true 
   {{if .all}} AND (usopit = @lvn1 OR  usopit = @lvm1 OR usopit = @lve1 ) {{end}}
   {{if .wpt}} AND  worktp = @tps {{end}}
   {{if .typer}} AND  type = 2 {{end}}
   {{if .hpt}} AND  hourtp = @hps {{end}}
   {{if .alls}} AND  timeproj = @pta {{end}}
   {{if .before}} AND timeline.id < @before {{end}}
   {{if .pr_b}} AND amount >= @pr_b {{end}}
   {{if .search}} AND (title ILIKE '%' || @search || '%' ) {{end}} 
   {{if .tm1}} ORDER BY created_at DESC {{end}}
   {{if .bl}} ORDER BY likes_count DESC {{end}}
   {{if .rec}} ORDER BY comments_count DESC {{end}}
   LIMIT 10
   `, map[string]interface{}{

		"search": search,
		"before": before,
		"pr_b":   i,
		"lvn1":   lvn1,
		"lvm1":   lvm1,
		"lve1":   lve1,
		"all":    all,
		"alls":   alls,
		"pta":    pta,
		"tps":    tps,
		"hps":    hps,
		"wpt":    wpt,
		"hpt":    hpt,
		"tm1":    tm1,
		"tm2":    tm2,
		"tm3":    tm3,
		"lve4":   lve4,
		"bl":     bl,
		"typer":  typer,
		"rec":    recc,
	})

	rows, err := tx.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("coudnt:%v", err)
	}
	for rows.Next() {

		var cms Post
		if err = rows.Scan(&cms.TID, &cms.ID, &cms.UserId, &cms.Content, &cms.SpoilerOf, &cms.LikesCount, &cms.ComCount, &cms.CreatedAt, &cms.Username, &cms.Name, &cms.Imname, &cms.Amount, &cms.Tittle, &cms.Tag); err != nil {
			return nil, fmt.Errorf("sql error:%v", err)
		}

		cms.URL, _ = getObject("processed/100x100/" + cms.Name)
		cms.Imsrc, _ = getObject("processed/300x300/" + cms.Imname)
		if cms.UserId == uid {
			cms.Mine = true
		}
		cm = append(cm, cms)
	}
	if butt <= 1 {
		json, err := json.Marshal(cm)
		if err != nil {
			return nil, fmt.Errorf("sql error:%v", err)
		}
		v, err := client.Set(ctx, "Pt58a"+fmt.Sprintf("%v", before), json, 0).Result()

		if err != nil {
			return nil, fmt.Errorf("sql error:%v", err)
		}
		fmt.Println(v)
	}
	if butt >= 2 {
		json, err := json.Marshal(cm)
		if err != nil {
			return nil, fmt.Errorf("sql error:%v", err)
		}
		v, err := client.Set(ctx, "Fl5t8a"+fmt.Sprintf("%v", before), json, 0).Result()

		if err != nil {
			return nil, fmt.Errorf("sql error:%v", err)
		}
		fmt.Println(v)
	}

	return cm, nil

}

func (s *Service) GetAllPostz(ctx context.Context, before int64, last string, search string) ([]Post, error) {
	_, ok := ctx.Value(KeyAuthUserID).(string)
	if !ok {
		return nil, ErrUnauthenticated
	}
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return nil, fmt.Errorf("coudnt:%v", err)
	}
	last = "5"

	defer tx.Rollback()
	args := []interface{}{last}
	cm := make([]Post, 0, 4)
	query := ` SELECT   posts.id, posts.user_id, posts.content, posts.spoiler_of, posts.likes_count, posts.comments_count, posts.created_at, users.username, avatar.name, images.name,  posts.title  
	FROM post_likes  
	INNER JOIN posts ON posts.user_id = post_likes.user_id AND posts.id = post_likes.post_id 
	INNER JOIN users ON post_likes.user_id = users.id 
	INNER JOIN avatar ON avatar.user_id = post_likes.user_id 
	inner JOIN images ON images.post_id = posts.id
	WHERE post_likes.user_id = post_likes.user_id AND post_likes.post_id = post_likes.post_id 
	`
	if before != 0 {
		query += `
	 AND timeline.id < $2 `
		args = append(args, before)
		fmt.Println(args)
	}
	if search != "" {
		query += ` AND title ILIKE '%' || $2 || '%'  or content ILIKE '%' || $2 || '%' `
		args = append(args, search)
		fmt.Println(args)
	}
	query += `  
	ORDER BY posts.created_at DESC 
	LIMIT $1  `

	rows, err := tx.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("coudnt:%v", err)
	}
	for rows.Next() {

		var cms Post
		if err = rows.Scan(&cms.ID, &cms.UserId, &cms.Content, &cms.SpoilerOf, &cms.LikesCount, &cms.ComCount, &cms.CreatedAt, &cms.Username, &cms.Name, &cms.Imname, &cms.Tittle); err != nil {
			return nil, fmt.Errorf("sql error:%v", err)
		}
		cms.URL, _ = getObject("processed/100x100/" + cms.Name)
		cms.Imsrc, _ = getObject("processed/1000x1000/" + cms.Imname)
		cm = append(cm, cms)
	}

	return cm, nil

}
func (s *Service) GetAllTags(ctx context.Context) ([]Post, error) {

	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return nil, fmt.Errorf("coudnt:%v", err)
	}
	client := getClient()
	val, err := client.Get(ctx, "hk51T20").Result()
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(val, "val")
	var cm1 Postzz

	if err != nil {
		// handle error
	}
	err = json.Unmarshal([]byte(val), &cm1)

	if err != nil {
		fmt.Println("coudnt:%v", err)
	}

	if val != "" {
		fmt.Println(cm1, "valvalval")
		return cm1, nil
	}
	defer tx.Rollback()

	cm := make([]Post, 0, 4)
	query := ` SELECT  tag from tagss`

	rows, err := tx.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("coudnt:%v", err)
	}
	for rows.Next() {

		var cms Post
		if err = rows.Scan(&cms.TID); err != nil {
			return nil, fmt.Errorf("sql error:%v", err)
		}

		cm = append(cm, cms)
	}
	fmt.Println(cm, "tagiigi")
	json, err := json.Marshal(cm)
	if err != nil {
		return nil, fmt.Errorf("sql error:%v", err)
	}
	_, err = client.Set(ctx, "hk51T20", json, 0).Result()

	if err != nil {
		return nil, fmt.Errorf("sql error:%v", err)
	}
	return cm, nil

}
func (s *Service) GetAllPosttt(ctx context.Context, before int64, last string) ([]Post, error) {
	uid, ok := ctx.Value(KeyAuthUserID).(string)
	if !ok {
		return nil, ErrUnauthenticated
	}
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return nil, fmt.Errorf("coudnt:%v", err)
	}
	defer tx.Rollback()
	args := []interface{}{uid, last}
	cm := make([]Post, 0, 4)
	query := ` SELECT  timeline.id, posts.id, posts.user_id, content, spoiler_of, likes_count, comments_count, created_at, users.username, avatar.name  
	FROM posts 
	INNER JOIN users ON posts.user_id = users.id 
	INNER JOIN timeline ON timeline.post_id = posts.id
	INNER JOIN avatar ON avatar.user_id = posts.user_id 
	WHERE timeline.user_id = posts.user_id 
	`
	if before != 0 {
		query += `
	 AND timeline.id < $3 `
		args = append(args, before)
		fmt.Println(args)
	}
	query += `  
	ORDER BY created_at DESC 
	LIMIT $2  `
	rows, err := tx.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("coudnt:%v", err)
	}
	for rows.Next() {

		var cms Post
		if err = rows.Scan(&cms.TID, &cms.ID, &cms.UserId, &cms.Content, &cms.SpoilerOf, &cms.LikesCount, &cms.ComCount, &cms.CreatedAt, &cms.Username, &cms.Name); err != nil {
			return nil, fmt.Errorf("sql error:%v", err)
		}
		cms.URL, _ = getObject("processed/100x100/" + cms.Name)
		cm = append(cm, cms)
	}

	return cm, nil

}
func (s *Service) SearchTags(ctx context.Context, tag string) ([]Post, error) {

	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return nil, fmt.Errorf("coudnt:%v", err)
	}
	defer tx.Rollback()

	cm := make([]Post, 0, 4)
	query := ` SELECT  posts.user_id,content,created_at,title, posts.tag, posts.id, images.name from posts
	inner JOIN tags_relation ON tags_relation.pid = posts.id 
	inner JOIN tagss ON tags_relation.tid = tagss.id 
	inner JOIN images ON images.post_id = posts.id 
	where tagss.tag=$1`

	rows, err := tx.QueryContext(ctx, query, tag)
	if err != nil {
		return nil, fmt.Errorf("coudnt:%v", err)
	}
	for rows.Next() {

		var cms Post
		if err = rows.Scan(&cms.UserId, &cms.Content, &cms.CreatedAt, &cms.Tittle, &cms.Tag, &cms.ID, &cms.Name); err != nil {
			return nil, fmt.Errorf("sql error:%v", err)
		}
		cms.URL, err = getObject("processed/300x300/" + cms.Name)
		cm = append(cm, cms)
	}

	return cm, nil

}

func (s *Service) MimesPp(ctx context.Context) (Memes, error) {
	var cm Memes
	tx, err := s.db.BeginTx(ctx, nil)
	uid, _ := ctx.Value(KeyAuthUserID).(string)
	dt := time.Now()
	dt1 := dt.Format("2006-01-02") + " 00:00:00"
	dt2 := dt.Format("2006-01-02") + " 23:59:00"
	if err != nil {
		return cm, fmt.Errorf("coudnt:%v", err)
	}
	defer tx.Rollback()

	query := ` SELECT COUNT(*) FROM posts WHERE user_id=$3  and  created_at BETWEEN $1 and $2 `
	if err = tx.QueryRowContext(ctx, query, dt1, dt2, uid).Scan(&cm.Inter); err != nil {
		return cm, fmt.Errorf("coudnt insert timeline: %v", err)
	}
	if cm.Inter > 5 {
		cm.Mime = true
	} else {
		cm.Mime = false
	}

	fmt.Println("success")
	return cm, nil

}
func (s *Service) Orders(ctx context.Context, pid int64) (Post, error) {
	var cm Post
	tx, err := s.db.BeginTx(ctx, nil)
	uid, _ := ctx.Value(KeyAuthUserID).(string)
	fmt.Println(uid, "pidpid")
	if err != nil {
		return cm, fmt.Errorf("coudnt:%v", err)
	}
	clientt := getClient()
	val, err := clientt.Get(ctx, fmt.Sprint(uid)).Result()
	if err != nil {
		fmt.Println(err)
	}

	if val == "" {
		return cm, ErrUnauthenticated
	}
	defer tx.Rollback()

	query := ` SELECT  pid, uid, groups.id FROM comments LEFT JOIN groups ON groups.post_id = comments.pid WHERE comments.id=$1 `
	if err = tx.QueryRowContext(ctx, query, pid).Scan(&cm.ID, &cm.UserId, &cm.GID); err != nil {
		return cm, fmt.Errorf("coudnt insert timeline: %v", err)
	}
	query = ` SELECT  COUNT(*) from posts WHERE user_id=$2 and id=$1`
	if err = tx.QueryRowContext(ctx, query, &cm.ID, uid).Scan(&cm.Col); err != nil {
		return cm, fmt.Errorf("coudnt insert timeline: %v", err)
	}
	fmt.Println(cm.Col)
	if cm.Col == 1 {
		fmt.Println(cm.GID, "pidpid")
		fmt.Println(cm.UserId, "pidpid")
		query = "INSERT INTO groupU ( uid, gid )SELECT $1, $2 WHERE NOT EXISTS (SELECT 1 FROM groupU WHERE uid=$1 AND gid=$2) "
		if _, err = tx.ExecContext(ctx, query, cm.UserId, cm.GID); err != nil {
			return cm, fmt.Errorf("coudnt insert groups: %v", err)
		}
		query = "INSERT INTO orderzz ( pid, uid, gid, uidm )SELECT $1, $2, $3, $4 WHERE NOT EXISTS (SELECT 1 FROM orders WHERE  pid=$3) "
		if _, err = tx.ExecContext(ctx, query, cm.ID, cm.UserId, cm.GID, uid); err != nil {
			return cm, fmt.Errorf("coudnt insert groups: %v", err)
		}
		query = "UPDATE  comments SET  selecter = true WHERE id = $1 "
		if _, err = tx.ExecContext(ctx, query, pid); err != nil {
			return cm, fmt.Errorf("coudnt insert groups: %v", err)
		}
		if err = tx.Commit(); err != nil {
			return cm, fmt.Errorf("coudnt commit create post: %v", err)
		}
		fmt.Println("mine")
	}
	fmt.Println("success")
	return cm, nil

}
func (s *Service) Perfom(ctx context.Context) ([]Post, error) {

	tx, err := s.db.BeginTx(ctx, nil)
	uid, _ := ctx.Value(KeyAuthUserID).(string)
	clientt := getClient()
	val, err := clientt.Get(ctx, fmt.Sprint(uid)).Result()
	if err != nil {
		fmt.Println(err)
	}

	if val == "" {
		return nil, ErrUnauthenticated
	}
	cm := make([]Post, 0, 4)
	if err != nil {
		return cm, fmt.Errorf("coudnt:%v", err)
	}
	defer tx.Rollback()
	query := ` SELECT  pid, uid, gid, users.username, created_at, users.id FROM orderzz 
	LEFT JOIN users ON users.id = orderzz.uid 
    WHERE uidm=$1  `
	rows, err := tx.QueryContext(ctx, query, uid)
	if err != nil {
		return cm, fmt.Errorf("coudnt insert timeline: %v", err)
	}
	defer rows.Close()
	for rows.Next() {

		var cms Post
		if err = rows.Scan(&cms.ID, &cms.UserId, &cms.GID, &cms.Username, &cms.CreatedAt, &cms.UserId); err != nil {
			return nil, fmt.Errorf("sql error:%v", err)
		}

		cm = append(cm, cms)
	}
	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("Empty: %v", err)

	}
	fmt.Println("success")
	return cm, nil

}
func (s *Service) PerfomProj(ctx context.Context, btn bool, uids int64) ([]Post, error) {

	tx, err := s.db.BeginTx(ctx, nil)
	uid, _ := ctx.Value(KeyAuthUserID).(string)
	clientt := getClient()
	val, err := clientt.Get(ctx, fmt.Sprint(uid)).Result()
	if err != nil {
		fmt.Println(err)
	}

	if val == "" {
		return nil, ErrUnauthenticated
	}
	cm := make([]Post, 0, 4)
	args := []interface{}{uid}
	if err != nil {
		return cm, fmt.Errorf("coudnt:%v", err)
	}
	defer tx.Rollback()
	query := ``
	if btn == true {
		query = ` SELECT  pid, uid, gid, users.username, orderzz.created_at, images.name,  comments_count, posts.content  FROM orderzz 
		LEFT JOIN users ON users.id = orderzz.uid 
		LEFT JOIN images ON images.post_id = pid
		LEFT JOIN posts ON posts.id = pid 
		WHERE uid=$1  `
		args = []interface{}{uids}
	} else {
		query = ` SELECT  pid, uid, gid, users.username, created_at FROM orderzz 
		LEFT JOIN users ON users.id = orderzz.uid 
		WHERE uid=$1  `
	}
	rows, err := tx.QueryContext(ctx, query, args...)
	if err != nil {
		return cm, fmt.Errorf("coudnt insert timeline: %v", err)
	}
	defer rows.Close()
	for rows.Next() {

		var cms Post
		if btn == true {
			if err = rows.Scan(&cms.ID, &cms.UserId, &cms.GID, &cms.Username, &cms.CreatedAt, &cms.Name, &cms.ComCount, &cms.Content); err != nil {
				return nil, fmt.Errorf("sql error:%v", err)
			}
			cms.URL, err = getObject("processed/300x300/" + cms.Name)
		} else {
			if err = rows.Scan(&cms.ID, &cms.UserId, &cms.GID, &cms.Username, &cms.CreatedAt); err != nil {
				return nil, fmt.Errorf("sql error:%v", err)
			}
		}
		cm = append(cm, cms)
	}
	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("Empty: %v", err)

	}
	fmt.Println("success")
	return cm, nil

}

func (s *Service) Deleted(ctx context.Context, pid int64) (Post, error) {
	var cm Post
	tx, err := s.db.BeginTx(ctx, nil)
	uid, _ := ctx.Value(KeyAuthUserID).(string)
	fmt.Println(uid, "pidpid")
	if err != nil {
		return cm, fmt.Errorf("coudnt:%v", err)
	}
	defer tx.Rollback()
	query := " UPDATE  posts SET  deleted = true WHERE id = $1 "
	if _, err = tx.ExecContext(ctx, query, pid); err != nil {
		return cm, fmt.Errorf("coudnt insert groups: %v", err)
	}
	if err = tx.Commit(); err != nil {
		return cm, fmt.Errorf("coudnt commit create post: %v", err)
	}
	fmt.Println("mine")
	return cm, nil
}
func (s *Service) Updatepost(ctx context.Context, pid int64) (Post, error) {
	var cm Post
	tx, err := s.db.BeginTx(ctx, nil)
	uid, _ := ctx.Value(KeyAuthUserID).(string)
	fmt.Println(uid, "pidpid")
	if err != nil {
		return cm, fmt.Errorf("coudnt:%v", err)
	}
	clientt := getClient()
	val, err := clientt.Get(ctx, fmt.Sprint(uid)).Result()
	if err != nil {
		fmt.Println(err)
	}

	if val == "" {
		return cm, ErrUnauthenticated
	}
	defer tx.Rollback()
	query := " UPDATE  posts SET  deleted = true WHERE id = $1 "
	if _, err = tx.ExecContext(ctx, query, pid); err != nil {
		return cm, fmt.Errorf("coudnt insert groups: %v", err)
	}
	if err = tx.Commit(); err != nil {
		return cm, fmt.Errorf("coudnt commit create post: %v", err)
	}
	fmt.Println("mine")
	return cm, nil
}
func (s *Service) Tagimg(ctx context.Context, tag string) (Post, error) {
	var cm Post
	tx, err := s.db.BeginTx(ctx, nil)
	uid, _ := ctx.Value(KeyAuthUserID).(string)
	fmt.Println(uid, "pidpid")
	if err != nil {
		return cm, fmt.Errorf("coudnt:%v", err)
	}
	defer tx.Rollback()
	query := " Select name from images inner join tagss on images.post_id=tagss.pid inner join posts on posts.id=tagss.pid  where tagss.tag=$1 order by likes_count DESC LIMIT 1;"
	if err = tx.QueryRowContext(ctx, query, tag).Scan(&cm.Name); err != nil {
		return cm, fmt.Errorf("coudnt insert groups: %v", err)
	}

	fmt.Println("mine")
	cm.URL, err = getObject("processed/300x300/" + cm.Name)
	return cm, nil
}

//SELECT   comments.pid, comments.uid, comments.gid FROM comments LEFT JOIN groups ON groups.post_id = comments.pid WHERE comments.id=595219722318381057;
//INSERT INTO groupU ( uid, gid ) VALUES (593783819431936001, 622948525041221633) ON CONFLICT (uid, gid) DO UPDATE  SET uid = 593783819431936001, gid =622948525041221633;
//INSERT INTO groupU ( uid, gid )SELECT 593783819431936001, 622948525041221633 WHERE NOT EXISTS (SELECT 1 FROM groupU WHERE uid=593783819431936001 AND gid=622948525041221633);
//SELECT  COUNT(*) from posts WHERE user_id=599139051183374337 and id=622978489216892929
