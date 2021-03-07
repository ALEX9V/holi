package handler

import (
	"context"
	"fmt"
	"io"
	"mime"
	"mime/multipart"
	"net/http"
	"social/internal/service"

	"github.com/matryer/way"
)

type handler struct {
	Service
}
type Service interface {
	AuthUserID(token string) (string, error)
	Login(ctx context.Context, email string, pass string) (service.LoginOutput, error)
	AuthUser(ctx context.Context) (service.User, error)
	CrateCmmment(ctx context.Context, pid int64, value string, title string, username string) (service.Com, error)
	GetAll(ctx context.Context, pid int64) ([]service.Com, error)
	UpdateCom(ctx context.Context, cid int64, value string, title string) (service.Com, error)
	Posts(ctx context.Context, username string, last int, before int64) ([]service.Post, error)
	Post(ctx context.Context, pid int64, last int, before int64) ([]service.Post, error)
	CreatePost(ctx context.Context, content string, age int, access int, title string, spoilerOf *string, nsfw bool, tag string, amount string, acpt string, worktp string, hourtp string, lh09MVP string) (service.TimelineItem, error)
	UploadAvatar(ctx context.Context, filename string) (string, error)
	ToggleLikes(ctx context.Context, postID int64) (service.ToggleLikeOutput, error)
	Users(ctx context.Context, search string, first int, after string) ([]service.UserProfile, error)
	User(ctx context.Context, username string) (service.UserProfile, error)
	ToggleFollow(ctx context.Context, username string) (service.ToggleFollowOutput, error)
	CreateUser(ctx context.Context, email, username string, pass string, jgfi9rnm string, ko2gf3sae string) error
	Followees(ctx context.Context, username string, first int, after string) ([]service.UserProfile, error)
	Followers(ctx context.Context, username string, first int, after string) ([]service.UserProfile, error)
	AvatarUP(ctx context.Context, r io.Reader) (string, error)
	Token(ctx context.Context) (service.TokenOutput, error)
	Timeline(ctx context.Context, last int, before int64) ([]service.Post, error)
	UploadPost(ctx context.Context, filename string, pid string) (string, error)
	CommentStream(ctx context.Context, postID string) (<-chan service.Com, error)
	Notifications(ctx context.Context, last int, before string) ([]service.Notification, error)
	NotificationStream(ctx context.Context, before string) (<-chan service.Notification, error)
	TimelineItemStream(ctx context.Context) (<-chan service.TimelineItem, error)
	HasUnreadNotifications(ctx context.Context) (bool, error)
	MarkNotificationAsRead(ctx context.Context, notificationID string) error
	MarkNotificationsAsRead(ctx context.Context) error
	DeleteTimelineItem(ctx context.Context, timelineItemID string) error
	GetAllPost(ctx context.Context, before int64, last string, search string, prb string, lvn bool, lvm bool, lve bool, pto bool, pta bool, tps bool, hps bool, butt int, bl bool, typer bool, recc bool) ([]service.Post, error)
	CrateMessange(ctx context.Context, uid2 string, message string, value string, lh09MVP string) (service.Mess, error)
	GetAllMess(ctx context.Context, uid2 string, before string, befores int64, last int, lh09MVP string) ([]service.Mess, error)
	Timelinemess(ctx context.Context, before int64, lh09MVP string) ([]service.Mess, error)
	MessageStream(ctx context.Context, before string, lh09MVP string) (<-chan service.Mess, error)
	MarkMessAsRead(ctx context.Context, notificationID string, lh09MVP string) error
	GetAllMes(ctx context.Context, uid2 string, before string, lh09MVP string) ([]service.Mess, error)
	CreateGroup(ctx context.Context, theme string, opis string, postID string, closer string, pass string, out string) (service.Group, error)
	GetAllGroup(ctx context.Context, before int64, out string) ([]service.Group, error)
	ShowGp(ctx context.Context, pid string, out string) ([]service.Group, error)
	CreateStoryGp(ctx context.Context, gid string, pid string, value string, title string, username string, out string, filename []*multipart.FileHeader) (service.Com, error)
	GetAllStGp(ctx context.Context, pid int64, out string) ([]service.Group, error)
	ChUg(ctx context.Context, pid string, out string) ([]service.Group, error)
	RegUsGr(ctx context.Context, gid string, pass string, out string) (service.Group, error)
	ListofUser(ctx context.Context, pid string, out string) ([]service.Group, error)
	VidGp(ctx context.Context, gid string, value string, out string) (service.Group, error)
	GetVidGp(ctx context.Context, gid string, before int64, out string) ([]service.Group, error)
	CreateGpMessange(ctx context.Context, gid string, message string, lh09MVP string) (service.Mess, error)
	GetAllMesGp(ctx context.Context, gid string, lh09MVP string) ([]service.Mess, error)
	GpStream(ctx context.Context, before string, GID string) (<-chan service.Group, error)
	Gps(ctx context.Context, last int, before string) ([]service.Group, error)
	GetAllTags(ctx context.Context) ([]service.Post, error)
	SearchTags(ctx context.Context, tag string) ([]service.Post, error)
	MarkNotification(ctx context.Context, types string) error
	UsersShSetting(ctx context.Context, check, city, op, opi, pol, sci, ln, fn, olp, nwp, lh09MVP string) error
	GetAllPostz(ctx context.Context, before int64, last string, search string) ([]service.Post, error)
	MimesPp(ctx context.Context) (service.Memes, error)
	MimesUs(ctx context.Context) (service.Memes, error)
	Orders(ctx context.Context, pid int64) (service.Post, error)
	Perfom(ctx context.Context) ([]service.Post, error)
	PerfomProj(ctx context.Context, btn bool, uids int64) ([]service.Post, error)
	Deleted(ctx context.Context, pid int64) (service.Post, error)
	ToggleRating(ctx context.Context, uid2 int64, raty float64, content string) (service.ToggleLikeOutput, error)
	Updatepost(ctx context.Context, pid int64) (service.Post, error)
	UploadPostIm(ctx context.Context, filename string, pid int64) (string, error)
	StPrtUser(ctx context.Context, content bool) (service.ToggleLikeOutput, error)
	UPPost(ctx context.Context, content string, age int, access int, title string, spoilerOf *string, nsfw bool, tag string, amount string, acpt string, worktp string, hourtp string, pid int64, lh09MVP string) (service.TimelineItem, error)
	Tagimg(ctx context.Context, tag string) (service.Post, error)
	UploadPostMulti(ctx context.Context, filename []*multipart.FileHeader, gid string) (string, error)
}

func New(s Service, dev bool) http.Handler {

	h := &handler{s}
	api := way.NewRouter()
	api.HandleFunc("GET", "/chat", h.timelineM)
	api.HandleFunc("GET", "/imgtg", h.tagimg)
	api.HandleFunc("GET", "/mime", h.mimestPt)
	api.HandleFunc("GET", "/mimes", h.mimestUs)
	api.HandleFunc("GET", "/tags", h.getAllTags)
	api.HandleFunc("GET", "/group/:id/vidjet", h.getvidGp)
	api.HandleFunc("POST", "/message", h.message)
	api.HandleFunc("POST", "/users/rating", h.togglRaty)
	api.HandleFunc("GET", "/group/:id/gps", h.gps)
	api.HandleFunc("POST", "/message/:id/gp", h.gpmessage)
	api.HandleFunc("GET", "/message/:id/gp", h.getAllMesGp)
	api.HandleFunc("POST", "/group/:id/new", h.createStroryGp)
	api.HandleFunc("POST", "/group/:id/vidjet", h.vidGp)
	api.HandleFunc("POST", "/groups/:id/", h.regUsGr)
	api.HandleFunc("GET", "/groups/:id/user", h.listOfUser)
	api.HandleFunc("POST", "/group/new", h.group)
	api.HandleFunc("GET", "/group", h.groups)
	api.HandleFunc("GET", "/group/story/:id", h.allStGp)
	api.HandleFunc("GET", "/group/:id", h.showGp)
	api.HandleFunc("POST", "/group/:id", h.chUg)
	api.HandleFunc("POST", "/updates/:id", h.updatePostim)
	api.HandleFunc("POST", "/postd/:id", h.deleted)
	api.HandleFunc("POST", "/orders/:id", h.orders)
	api.HandleFunc("POST", "message/:id/mark_as_read", h.markMessAsRead)
	api.HandleFunc("GET", "/message/:id/mess", h.getAllMess)
	api.HandleFunc("GET", "/message/:id/mes", h.getAllMes)
	api.HandleFunc("POST", "/post", h.createPost)
	api.HandleFunc("GET", "/posts", h.getAllPosts)
	api.HandleFunc("GET", "/postz", h.getAllPostz)
	api.HandleFunc("POST", "/login", h.login)
	api.HandleFunc("GET", "users/:username/posts", h.posts)
	api.HandleFunc("POST", "users/status", h.statusProjectUser)
	api.HandleFunc("POST", "post/:id", h.createComment)
	//api.HandleFunc("GET", "/users", h.users)
	api.HandleFunc("GET", "/users", h.users)
	api.HandleFunc("GET", "/tags/:tag", h.searchTags)
	api.HandleFunc("POST", "/users/update", h.updateAvatar)
	api.HandleFunc("POST", "/users/updates", h.updateUser)
	api.HandleFunc("PUT", "/auth/avatar", h.updateAvatar)
	api.HandleFunc("GET", "users/:username/followees", h.followees)
	api.HandleFunc("GET", "users/:username/followers", h.followers)
	api.HandleFunc("GET", "/users/:username", h.user)
	api.HandleFunc("POST", "/signup", h.createUser)
	api.HandleFunc("POST", "/users/:username/toggle_follow", h.toggleFollow)
	api.HandleFunc("POST", "/post/:post_id/toggle_like", h.toggleLikes)
	api.HandleFunc("GET", "/post/:id/comment", h.allcomment)
	api.HandleFunc("GET", "/notifications", h.notifications)
	api.HandleFunc("GET", "/post/:id", h.post)
	api.HandleFunc("POST", "/comment/:com_id/edit", h.updateCmment)
	api.HandleFunc("GET", "/timeline", h.timeline)
	api.HandleFunc("GET", "/perfomance", h.perfom)
	api.HandleFunc("GET", "/projects", h.perfompr)
	api.HandleFunc("POST", "/users/upload", h.uploadPost)
	//api.HandleFunc("POST", "/milti", h.uploadmultiPost)
	api.HandleFunc("GET", "/has_unread_notifications", h.hasUnreadNotifications)
	api.HandleFunc("POST", "/notification", h.markNotification)
	api.HandleFunc("POST", "/notifications/:notification_id/mark_as_read", h.markNotificationAsRead)
	api.HandleFunc("POST", "notifications/:notification_id/mark_as_read", h.markNotificationsAsRead)
	api.HandleFunc("POST", "/post/:id/updater", h.upPost)

	mime.AddExtensionType(".js", "application/javascript; charset=utf-8")
	fs := http.FileServer(&spaFileSystem{http.Dir("web/static")})
	if dev {
		fs = withoutCache(fs)
	}
	r := way.NewRouter()
	r.NotFound = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusNotFound)
		fmt.Fprintf(w, "This is not the page you are looking for")
	})

	r.Handle("*", "/api...", http.StripPrefix("/api", h.withAuth(api)))
	r.Handle("GET", "/...", fs)
	fmt.Println("handler,go")
	return r
}
