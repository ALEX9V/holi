package service

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"image"
	"image/jpeg"
	"image/png"
	"io"
	"log"
	"math"
	"os"
	"path"
	"regexp"
	"strings"
	"time"

	"github.com/disintegration/imaging"
	gonanoid "github.com/matoous/go-nanoid"
)

const MaxAvatarBytes = 5 << 20

var (
	rxUsername = regexp.MustCompile(`^[a-zA-Z][a-zA-Z0-9_-]{0,17}$`)
	rxEmail    = regexp.MustCompile(`^[^\s@]+@[^\s@]+\.[^\s@]+$`)
	avatarDir  = path.Join("web", "static", "img", "avatars")
)
var (
	ErrInvalidSpoiler         = errors.New("спойлер не может быть пустым")
	ErrPostLenth              = errors.New("заполните пост")
	ErrSQLERROR               = errors.New("sql ошибка транзакции")
	ErrUserNoFound            = errors.New("user not found")
	ErrInvalidEmail           = errors.New("invalid email")
	ErrInvalidUsername        = errors.New("invalid username")
	ErrEmailTaken             = errors.New("unique email")
	ErrUsernameTaken          = errors.New("unique email")
	ErrUnauthenticated        = errors.New("ErrUnauthenticated")
	ErrOurSelf                = errors.New("не могу подписаться на себя")
	ErrOurExistance           = errors.New("вы уже подписанны")
	ErrInvalidUser            = errors.New("пользователя не существует")
	ErrForbiddenFollow        = errors.New("не могу подписаться")
	ErrUnsuportedAvatarFormat = errors.New("не поддерживыемый формат")
	ErrPostLike               = errors.New("не найден пост")
)

func (s *Service) userById(ctx context.Context, id string) (User, error) {
	var u User
	query := "SELECT username FROM users WHERE id = $1"
	err := s.db.QueryRowContext(ctx, query, id).Scan(&u.Username)
	if err == sql.ErrNoRows {
		return u, ErrUserNoFound
	}
	if err != nil {
		return u, fmt.Errorf("codnt auth user: %v", err)
	}

	u.ID = id
	return u, nil

}

type UserProfile struct {
	Raty string
	User
	Email          string
	FolloweesCount int
	FollowersCount int
	Me             bool
	Following      bool
	Followeed      bool
	Name           string
	URL            string
	Opit           string
	About          string
	Age            string
	City           string
	Skils          string
	Ago            string
	Count          float64
	Status         bool
	Fname          string
	LastNane       string
}
type User struct {
	ID       string `json:"id"`
	Username string `json:"username"`
}
type ToggleFollowOutput struct {
	Following      bool `json:"following"`
	FollowersCount int  `json:"followersCount"`
}

func (s *Service) Users(ctx context.Context, search string, first int, after string) ([]UserProfile, error) {
	search = strings.TrimSpace(search)
	after = strings.TrimSpace(after)
	first = normalizePageSize(first)
	fmt.Println("profile")
	uid, auth := ctx.Value(KeyAuthUserID).(string)
	query, args, err := buildQuery(`
	SELECT users.id, email, username, followers_count, followees_count, avatar.name, raty  
	{{if .auth}}
	, followers.follwer_id IS NOT NULL AS following
	, followees.follwee_id IS NOT NULL AS followeed
	{{end}}
	 FROM users 
	 {{if .auth}}
	 LEFT JOIN follows AS followers ON followers.follwer_id = @uid AND followers.follwee_id = users.id
	 LEFT JOIN follows AS followees ON followees.follwer_id = users.id AND followees.follwee_id = @uid
	 LEFT JOIN avatar ON avatar.user_id = users.id 
	 {{end}}
	 {{if  or .search .after}}WHERE{{end}}
	 {{if .search}} username ILIKE '%' || @search || '%' {{end}}
	 {{if and .search .after}}AND{{end}}
	 {{if .after}}username > @after{{end}}
	 ORDER BY username ASC
	 LIMIT @first`, map[string]interface{}{
		"auth":   auth,
		"uid":    uid,
		"search": search,
		"first":  first,
		"after":  after,
	})
	if err != nil {
		return nil, fmt.Errorf("coudnt build users sql query: %v", err)
	}
	log.Printf("query:%s\nargs: %v\n", query, args)
	rows, err := s.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("coudnt select user: %v", err)
	}
	defer rows.Close()
	uu := make([]UserProfile, 0, first)
	for rows.Next() {
		var u UserProfile
		dest := []interface{}{&u.ID, &u.Email, &u.Username, &u.FollowersCount, &u.FolloweesCount, &u.Name, &u.Raty}
		if auth {
			dest = append(dest, &u.Following, &u.Followeed)
		}
		if err = rows.Scan(dest...); err != nil {
			return nil, fmt.Errorf("coudnt scan user: %v", err)
		}
		u.URL, _ = getObject("processed/100x100/" + u.Name)
		u.Me = auth && uid == u.ID
		if !u.Me {
			u.ID = ""
			u.Email = ""
		}
		uu = append(uu, u)
	}
	if err = rows.Err(); err != nil {
		return uu, fmt.Errorf("coudnt user rows: %v", err)
	}
	return uu, nil
}

func (s *Service) User(ctx context.Context, username string) (UserProfile, error) {
	var u UserProfile
	username = strings.TrimSpace(username)
	if !rxUsername.MatchString(username) {
		return u, ErrInvalidUsername
	}

	var yids string
	uid, auth := ctx.Value(KeyAuthUserID).(string)
	if !auth {
		return u, ErrInvalidUsername
	}
	client := getClient()

	query := "SELECT id, username FROM users WHERE id = $1 AND username = $2"
	errs := s.db.QueryRowContext(ctx, query, uid, username).Scan(&yids)

	if errs == sql.ErrNoRows {
		auth = false
		uid = " "
	}

	fmt.Println(uid)
	args := []interface{}{username}
	dest := []interface{}{&u.ID, &u.Email, &u.FolloweesCount, &u.FollowersCount, &u.Name, &u.About, &u.Skils, &u.City, &u.Opit, &u.Ago, &u.Count, &u.Status, &u.Fname, &u.LastNane}
	query = "SELECT users.id, email, followers_count, followees_count, avatar.name, about, skils, city, opit, dates, raty, statys, fnamer, lnmrl "
	if auth {
		query += ", " +
			"followers.follwer_id IS NOT NULL AS following, " +
			"followees.follwee_id IS NOT NULL AS followeed"

		dest = append(dest, &u.Following, &u.Followeed)
	}

	query += " FROM users "
	if auth {
		query += "LEFT JOIN follows AS followers ON followers.follwer_id = $2 AND followers.follwee_id = users.id " + "LEFT JOIN follows AS followees ON followees.follwer_id = users.id AND followees.follwee_id = $2"
		args = append(args, uid)

	}

	query += " LEFT JOIN avatar ON avatar.user_id = users.id "

	query += " WHERE username = $1"
	err := s.db.QueryRowContext(ctx, query, args...).Scan(dest...)
	if err == sql.ErrNoRows {
		return u, ErrUserNoFound
	}
	val, err := client.Get(ctx, "user"+fmt.Sprint(u.ID)).Result()
	fmt.Println("user"+fmt.Sprint(uid), "fmt.Sprint(uid)")
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(val, "val")

	err = json.Unmarshal([]byte(val), &u)

	if err != nil {
		fmt.Println("coudnt:%v", err)
	}

	if val != "" {
		fmt.Println(u, "valvalval")
		return u, nil
	}
	t := math.Round(u.Count*100) / 100
	u.Raty = fmt.Sprint(t)
	u.Username = username
	u.Me = auth && uid == u.ID
	u.URL, err = getObject("processed/100x100/" + u.Name)
	if !u.Me {

		u.Email = ""
	}
	json, err := json.Marshal(u)
	if err != nil {
		return u, fmt.Errorf("sql error:%v", err)
	}

	v, err := client.Set(ctx, "user"+u.ID, json, 0).Result()
	fmt.Println(v, "hjkhjkhkjhjktgyugtuaaaaay")
	if err != nil {
		return u, fmt.Errorf("sql error:%v", err)
	}
	fmt.Println(v)
	return u, nil
}
func (s *Service) ToggleFollow(ctx context.Context, username string) (ToggleFollowOutput, error) {
	var out ToggleFollowOutput
	followerID, ok := ctx.Value(KeyAuthUserID).(string)
	if !ok {
		return out, ErrUnauthenticated
	}
	username = strings.TrimSpace(username)
	if !rxUsername.MatchString(username) {
		return out, ErrInvalidUsername
	}

	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return out, fmt.Errorf("coudnt begin tx: %v", err)
	}
	defer tx.Rollback()
	var followeeID string
	query := "SELECT id FROM users WHERE username = $1"
	err = tx.QueryRowContext(ctx, query, username).Scan(&followeeID)
	if err == sql.ErrNoRows {
		return out, ErrUserNoFound
	}
	if err != nil {
		return out, fmt.Errorf("coudnt begin tx: %v", err)
	}
	if followeeID == followerID {
		return out, ErrForbiddenFollow
	}
	fmt.Print("shag 0")
	query = "SELECT EXISTS (SELECT 1 FROM follows WHERE follwer_id = $1 AND follwee_id = $2)"
	if err = tx.QueryRowContext(ctx, query, followerID, followeeID).Scan(&out.Following); err != nil {
		fmt.Print("shag 1")
		return out, fmt.Errorf("coudnt begin tx: %v", err)

	}
	fmt.Print("shag 0")
	if out.Following {
		query = "DELETE FROM follows WHERE follwer_id = $1 AND follwee_id = $2"
		if _, err = tx.ExecContext(ctx, query, followerID, followeeID); err != nil {
			fmt.Print("shag 2")
			return out, fmt.Errorf("coudnt dlete follow: %v", err)
		}
		query = "UPDATE users SET followees_count = followees_count - 1 WHERE id = $1"
		if _, err = tx.ExecContext(ctx, query, followerID); err != nil {
			fmt.Print("shag 3")
			return out, fmt.Errorf("coudnt dlete follow: %v", err)
		}
		query = "UPDATE users SET followers_count = followers_count - 1 WHERE id = $1 RETURNING followers_count"
		if err = tx.QueryRowContext(ctx, query, followeeID).Scan(&out.FollowersCount); err != nil {
			fmt.Print("shag 4")
			return out, fmt.Errorf("coudnt update follow: %v", err)
		}

	} else {
		fmt.Print("shag else")
		query = "INSERT INTO follows (follwer_id, follwee_id) VALUES ($1, $2)"
		if _, err = tx.ExecContext(ctx, query, followerID, followeeID); err != nil {
			fmt.Print("shag 5")
			return out, fmt.Errorf("coudnt insert follow: %v", err)
		}
		query = "UPDATE users SET followees_count = followees_count + 1 WHERE id = $1"
		if _, err = tx.ExecContext(ctx, query, followerID); err != nil {
			fmt.Print("shag 6")
			return out, fmt.Errorf("coudnt update follow: %v", err)
		}
		query = "UPDATE users SET followers_count = followers_count + 1 WHERE id = $1 RETURNING followers_count"
		if err = tx.QueryRowContext(ctx, query, followeeID).Scan(&out.FollowersCount); err != nil {
			fmt.Print("shag 7")
			return out, fmt.Errorf("coudnt update follow 4: %v", err)
		}
	}
	if err = tx.Commit(); err != nil {
		fmt.Print("shag 8")
		return out, fmt.Errorf("coudnt toggle follow: %v", err)
	}
	out.Following = !out.Following
	if out.Following {
		go s.notifyFollow(followerID, followeeID)
	}

	return out, nil
}

func (s *Service) CreateUser(ctx context.Context, email, username string, pass string, jgfi9rnm string, ko2gf3sae string) error {
	var filename string = "avatar.png"
	email = strings.TrimSpace(email)
	if !rxEmail.MatchString(email) {
		return ErrInvalidEmail
	}

	var id int64
	username = strings.TrimSpace(username)
	if !rxUsername.MatchString(username) {
		return ErrInvalidUsername
	}
	fmt.Println(email)
	fmt.Println(username)
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return fmt.Errorf("coudnt begin tx: %v", err)
	}
	defer tx.Rollback()

	query := "INSERT INTO users (email, username, password, fnamer, lnmrl) VALUES ($1, $2, $3, $4, $5) RETURNING id; "
	if err := tx.QueryRowContext(ctx, query, email, username, pass, jgfi9rnm, ko2gf3sae).Scan(&id); err != nil {

		return fmt.Errorf("could not insert user: %v", err)
	}

	unique := isUniqueViolation(err)
	if unique && strings.Contains(err.Error(), "email") {
		return ErrEmailTaken
	}
	fmt.Println(id)
	if err != nil {
		return fmt.Errorf("could not insert user: %v", err)
	}

	query = "INSERT INTO avatar (user_id, name) VALUES ($1, $2)"
	if _, err = tx.ExecContext(ctx, query, id, filename); err != nil {

		return fmt.Errorf("could not insert user: %v", err)
	}
	if err = tx.Commit(); err != nil {
		fmt.Print("shag 8")
		return fmt.Errorf("coudnt toggle follow: %v", err)
	}

	return nil
}
func (s *Service) Followees(ctx context.Context, username string, first int, after string) ([]UserProfile, error) {
	username = strings.TrimSpace(username)
	if !rxUsername.MatchString(username) {
		return nil, ErrInvalidUsername
	}
	after = strings.TrimSpace(after)
	first = normalizePageSize(first)
	uid, auth := ctx.Value(KeyAuthUserID).(string)
	query, args, err := buildQuery(`
	SELECT id, email, username,followers_count, followees_count
		{{if .auth}}
		, followers.follwer_id IS NOT NULL AS following
		, followees.follwee_id IS NOT NULL AS followeed
		{{end}}
	   FROM follows
	   INNER JOIN  users ON follows.follwee_id = users.id
	   {{if .auth}}
	   LEFT JOIN follows AS followers
	   ON followers.follwer_id = @uid AND followers.follwee_id = users.id
	   LEFT JOIN follows AS followees 
 	    ON followees.follwer_id = users.id AND followees.follwee_id = @uid
	   {{end}}
	   WHERE follows.follwer_id = (SELECT id FROM users WHERE username = @username)
	   {{if .after}} AND username > @after {{end}}
	   ORDER BY username ASC
	   LIMIT @first`, map[string]interface{}{
		"auth":     auth,
		"uid":      uid,
		"username": username,
		"first":    first,
		"after":    after,
	})
	if err != nil {
		return nil, fmt.Errorf("coudnt build users sql query: %v", err)
	}
	log.Printf("query:%s\nargs: %v\n", query, args)
	rows, err := s.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("coudnt select followees: %v", err)
	}
	defer rows.Close()
	uu := make([]UserProfile, 0, first)
	for rows.Next() {
		var u UserProfile
		dest := []interface{}{&u.ID, &u.Email, &u.Username, &u.FollowersCount, &u.FolloweesCount}
		if auth {
			dest = append(dest, &u.Following, &u.Followeed)
		}
		if err = rows.Scan(dest...); err != nil {
			return nil, fmt.Errorf("coudnt scan follower: %v", err)
		}
		u.Me = auth && uid == u.ID
		if !u.Me {
			u.ID = ""
			u.Email = ""
		}
		uu = append(uu, u)
	}
	if err = rows.Err(); err != nil {
		return uu, fmt.Errorf("coudnt follower rows: %v", err)
	}
	return uu, nil
}
func (s *Service) Followers(ctx context.Context, username string, first int, after string) ([]UserProfile, error) {
	username = strings.TrimSpace(username)
	if !rxUsername.MatchString(username) {
		return nil, ErrInvalidUsername
	}
	after = strings.TrimSpace(after)
	first = normalizePageSize(first)
	uid, auth := ctx.Value(KeyAuthUserID).(string)
	query, args, err := buildQuery(`
	SELECT id, email, username, followers_count, followees_count
	 {{if .auth}}
	 , followers.follwer_id IS NOT NULL AS following
	 , followees.follwee_id IS NOT NULL AS followeed
 	 {{end}}
	  FROM follows
	  INNER JOIN  users ON follows.follwer_id = users.id
	  {{if .auth}}
	  LEFT JOIN follows AS followers ON followers.follwer_id = @uid AND followers.follwee_id = users.id
	  LEFT JOIN follows AS followees ON followees.follwer_id = users.id AND followees.follwee_id = @uid
	  {{end}}
	  WHERE follows.follwee_id =(SELECT id FROM users WHERE username = @username)
	   {{if .after}}AND username > @after{{end}}
	  ORDER BY username ASC
	  LIMIT @first`, map[string]interface{}{
		"auth":     auth,
		"uid":      uid,
		"username": username,
		"first":    first,
		"after":    after,
	})
	if err != nil {
		return nil, fmt.Errorf("coudnt build users sql query: %v", err)
	}
	log.Printf("query:%s\nargs: %v\n", query, args)
	rows, err := s.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("coudnt select followers: %v", err)
	}
	defer rows.Close()
	uu := make([]UserProfile, 0, first)
	for rows.Next() {
		var u UserProfile
		dest := []interface{}{&u.ID, &u.Email, &u.Username, &u.FollowersCount, &u.FolloweesCount}
		if auth {
			dest = append(dest, &u.Following, &u.Followeed)
		}
		if err = rows.Scan(dest...); err != nil {
			return nil, fmt.Errorf("coudnt scan follower: %v", err)
		}
		u.Me = auth && uid == u.ID
		if !u.Me {
			u.ID = ""
			u.Email = ""
		}
		uu = append(uu, u)
	}
	if err = rows.Err(); err != nil {
		return uu, fmt.Errorf("coudnt follower rows: %v", err)
	}
	return uu, nil
}
func (s *Service) AvatarUP(ctx context.Context, r io.Reader) (string, error) {
	uid, ok := ctx.Value(KeyAuthUserID).(string)
	if !ok {
		return "", ErrUnauthenticated
	}
	r = io.LimitReader(r, MaxAvatarBytes)
	img, format, err := image.Decode(r)
	if err != nil {
		return "", fmt.Errorf("coudnt read avatar: %v", err)
	}

	if format != "png" && format != "jpeg" {
		return "", ErrUnsuportedAvatarFormat
	}
	avatar, err := gonanoid.Nanoid()
	if err != nil {
		return "", fmt.Errorf("coudnt generate avatar filename: %v", err)
	}
	if format == "png" {
		avatar += ".png"
	} else {
		avatar += ".jpg"
	}
	avataPath := path.Join(avatarDir, avatar)
	f, err := os.Create(avataPath)
	if err != nil {
		return "", fmt.Errorf("coudnt avater file: %v", err)
	}
	defer f.Close()
	img = imaging.Fill(img, 400, 400, imaging.Center, imaging.CatmullRom)
	if format == "png" {
		err = png.Encode(f, img)
	} else {
		err = jpeg.Encode(f, img, nil)
	}
	if err != nil {
		return "", fmt.Errorf("coudnt write :%v", err)
	}
	var oldAvatar sql.NullString
	query := `UPDATE users SET avatar = $1 WHERE id = $2 RETURNING (SELECT avatar FROM users WHERE id = $2) AS old_avatar`
	if err = s.db.QueryRowContext(ctx, query, avatar, uid).Scan(&oldAvatar); err != nil {
		defer os.Remove(avataPath)
		return "", fmt.Errorf("coudntupdate avatar : %v", err)
	}
	if oldAvatar.Valid {
		defer os.Remove(path.Join(avatarDir, oldAvatar.String))
	}
	return "/img/avatars", nil
}

func (s *Service) UploadAvatar(ctx context.Context, filename string) (string, error) {
	fmt.Println(filename, "method")

	uid, _ := ctx.Value(KeyAuthUserID).(string)
	fmt.Println(uid)

	fmt.Println("method 2")
	query := "UPDATE avatar SET  name = $1 WHERE user_id = $2"
	_, err := s.db.ExecContext(ctx, query, filename, uid)
	if err != nil {
		return "", ErrSQLERROR
	}
	return "", nil

}
func (s *Service) UploadPostIm(ctx context.Context, filename string, pid int64) (string, error) {
	fmt.Println(filename, "method")

	uid, _ := ctx.Value(KeyAuthUserID).(string)
	fmt.Println(uid)

	fmt.Println("method 2")
	query := "UPDATE images SET  name = $1 WHERE post_id = $2 and user_id=$3"
	_, err := s.db.ExecContext(ctx, query, filename, pid, uid)
	if err != nil {
		return "", ErrSQLERROR
	}
	return "", nil

}
func (s *Service) UsersShSetting(ctx context.Context, check, city, op, opi, pol, sci, ln, fn, olp, nwp, lh09MVP string) error {
	fmt.Println(check, city, op, opi, pol, sci)
	uid, _ := ctx.Value(KeyAuthUserID).(string)
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return fmt.Errorf("coudnt begin tx: %v", err)
	}
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
	_ = clientt.Del(ctx, "user"+uid)
	defer tx.Rollback()

	query := "SELECT id FROM users WHERE  password=$1 AND id=$2 "
	counter := 0
	err = s.db.QueryRowContext(ctx, query, olp, uid).Scan(counter)
	if err == sql.ErrNoRows {
		return fmt.Errorf("error error: %v", err)
	}

	query, args, err := buildQuery(`
	UPDATE users SET dates=now() 
	{{if .check}}, checker= @check {{end}}
    {{if .ln}}, fnamer= @ln {{end}}
	{{if .fn}}, lnmrl= @fn {{end}}
	{{if .op}}, about= @op {{end}}
    {{if .pot}}, opit= @pot {{end}}
	{{if .sci}}, skils= @sci {{end}}
	{{if .nwp}}, password= @nwp {{end}}
	{{if .city}} , city= @city {{end}}
	 WHERE id = @uid `, map[string]interface{}{
		"check": check,
		"op":    op,
		"pot":   opi,
		"sci":   sci,
		"city":  city,
		"uid":   uid,
		"ln":    ln,
		"fn":    fn,
		"nwp":   nwp,
	})
	fmt.Println(query)
	if _, err := tx.ExecContext(ctx, query, args...); err != nil {

		return fmt.Errorf("could not insert userяя: %v", err)
	}

	if err != nil {
		return fmt.Errorf("could not insert user: %v", err)
	}

	if err = tx.Commit(); err != nil {
		fmt.Print("shag 8")
		return fmt.Errorf("coudnt toggle follow: %v", err)
	}

	return nil
}

func (s *Service) StPrtUser(ctx context.Context, content bool) (ToggleLikeOutput, error) {
	var out ToggleLikeOutput
	uid, ok := ctx.Value(KeyAuthUserID).(string)
	if !ok {
		return out, ErrUnauthenticated
	}
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return out, fmt.Errorf("coudnt:%v", err)
	}
	fmt.Println("ok1")
	defer tx.Rollback()
	query := "UPDATE users SET statys = $2  WHERE id = $1"
	if _, err = tx.ExecContext(ctx, query, uid, content); err != nil {
		return out, fmt.Errorf("coudnt post update and decremate post : %v", err)

	}
	fmt.Println("ok2")
	if err = tx.Commit(); err != nil {
		return out, fmt.Errorf("coudnt commit:%v", err)
	}

	return out, nil
}

func (s *Service) MimesUs(ctx context.Context) (Memes, error) {
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

	query := ` SELECT COUNT(*) FROM users WHERE id=$3  and  dates BETWEEN $1 and $2 `
	if err = tx.QueryRowContext(ctx, query, dt1, dt2, uid).Scan(&cm.Inter); err != nil {
		return cm, fmt.Errorf("coudnt insert timeline: %v", err)
	}
	if cm.Inter > 0 {
		cm.Mime = true
	} else {
		cm.Mime = false
	}

	fmt.Println("success")
	return cm, nil

}
