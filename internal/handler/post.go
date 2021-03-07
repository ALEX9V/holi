package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"social/internal/service"
	"strconv"
	"strings"

	"github.com/matryer/way"
)

type createPostInput struct {
	Content   string
	Ages      string
	Acess1    string
	Titles    string
	Tags      string
	SpoilerOf *string
	NSFW      bool
	Amoti     string
	Access    string
	Hourtp    string
	Worktp    string
}
type uploadPostInput struct {
	Age     int
	Access  int
	Content string
}

type Message struct {
	// Sender must be set, and must be either an application admin
	// or the currently signed-in user.
	Sender  string
	ReplyTo string // may be empty

	// At least one of these slices must have a non-zero length,
	// except when calling SendToAdmins.
	To, Cc, Bcc []string

	Subject string

	// At least one of Body or HTMLBody must be non-empty.
	Body     string
	HTMLBody string
}

func (h *handler) createPost(w http.ResponseWriter, r *http.Request) {
	var in createPostInput
	defer r.Body.Close()
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	age, _ := strconv.Atoi(in.Ages)
	access, _ := strconv.Atoi(in.Acess1)
	fmt.Println(in.Amoti, "in.Amounti")
	ua := r.Header.Get("authorization")
	replacer := strings.NewReplacer("Bearer ", "")
	PPvmt09 := replacer.Replace(ua)
	ti, err := h.CreatePost(r.Context(), in.Content, age, access, in.Titles, in.SpoilerOf, in.NSFW, in.Tags, in.Amoti, in.Access, in.Worktp, in.Hourtp, PPvmt09)
	if err == service.ErrUnauthenticated {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	if err == service.ErrPostLenth || err == service.ErrInvalidSpoiler {
		http.Error(w, err.Error(), http.StatusUnprocessableEntity)
		return
	}
	if err != nil {
		respondErr(w, err)
		return
	}
	respond(w, ti, http.StatusOK)

}
func (h *handler) upPost(w http.ResponseWriter, r *http.Request) {
	var in createPostInput
	defer r.Body.Close()
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	ctx := r.Context()
	postID, _ := strconv.ParseInt(way.Param(ctx, "id"), 10, 64)
	age, _ := strconv.Atoi(in.Ages)
	access, _ := strconv.Atoi(in.Acess1)
	fmt.Println(in.Amoti, "in.Amounti")
	ua := r.Header.Get("authorization")
	replacer := strings.NewReplacer("Bearer ", "")
	PPvmt09 := replacer.Replace(ua)
	ti, err := h.UPPost(r.Context(), in.Content, age, access, in.Titles, in.SpoilerOf, in.NSFW, in.Tags, in.Amoti, in.Access, in.Worktp, in.Hourtp, postID, PPvmt09)
	if err == service.ErrUnauthenticated {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}
	if err == service.ErrPostLenth || err == service.ErrInvalidSpoiler {
		http.Error(w, err.Error(), http.StatusUnprocessableEntity)
		return
	}
	if err != nil {
		respondErr(w, err)
		return
	}
	respond(w, ti, http.StatusOK)

}
func (h *handler) toggleLikes(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	postID, _ := strconv.ParseInt(way.Param(ctx, "post_id"), 10, 64)
	out, err := h.ToggleLikes(ctx, postID)
	if err == service.ErrUnauthenticated {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}
	if err == service.ErrPostLike {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}
	if err != nil {
		respondErr(w, err)
		return
	}
	respond(w, out, http.StatusOK)

}
func (h *handler) togglRaty(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	q := r.URL.Query()
	uid2, err := strconv.ParseInt(q.Get("user"), 10, 64)
	raty, err := strconv.ParseFloat(q.Get("value"), 64)
	if err != nil {
		respondErr(w, err)
		return
	}
	con := q.Get("val")
	out, err := h.ToggleRating(ctx, uid2, raty, con)
	fmt.Println(uid2, raty, "uid2, raty")
	if err == service.ErrUnauthenticated {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	if err == service.ErrPostLike {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}
	if err != nil {
		respondErr(w, err)
		return
	}
	respond(w, out, http.StatusOK)

}

func (h *handler) posts(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	q := r.URL.Query()
	last, _ := strconv.Atoi(q.Get("last"))

	before, ok := strconv.ParseInt(q.Get("before"), 10, 64)
	if ok != nil {
		before = 0
	}
	fmt.Print(before, "fmt.Print(before)fmt.Print(before)")
	fmt.Println(last)
	pp, err := h.Posts(ctx, way.Param(ctx, "username"), last, before)
	if err == service.ErrInvalidUsername {
		http.Error(w, err.Error(), http.StatusUnprocessableEntity)
		return
	}
	if err != nil {
		respondErr(w, err)
		return
	}
	respond(w, pp, http.StatusOK)

}
func (h *handler) getAllPosts(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	q := r.URL.Query()
	last := q.Get("last")
	search := q.Get("search")
	prb := q.Get("pr_b")
	lvn := q.Get("lv_n")
	lvm := q.Get("lv_m")
	lve := q.Get("lv_e")
	timerfreepost := q.Get("tm_o")
	timerallpost := q.Get("tm_a")
	tp := q.Get("tp_a")
	hp := q.Get("hr_b")
	but := q.Get("but")
	tpp := q.Get("news")
	rec := q.Get("rec")
	fmt.Println(lvn, lvm, lve, timerfreepost, timerallpost, tp, hp, "timerfreeposttimerfreepost")
	before, _ := strconv.ParseInt(q.Get("before"), 10, 64)
	ln, err := strconv.ParseBool(lvn)
	lm, err := strconv.ParseBool(lvm)
	le, err := strconv.ParseBool(lve)
	tps, err := strconv.ParseBool(tp)
	hps, err := strconv.ParseBool(hp)
	tpss, err := strconv.ParseBool(tpp)
	recc, err := strconv.ParseBool(rec)
	pto, err := strconv.ParseBool(timerfreepost)
	pta, err := strconv.ParseBool(timerallpost)
	bl, err := strconv.ParseBool(q.Get("bl"))
	butt, err := strconv.Atoi(but)
	fmt.Println(tpss, "tpsstpsstpss")
	pp, err := h.GetAllPost(ctx, before, last, search, prb, ln, lm, le, pto, pta, tps, hps, butt, bl, tpss, recc)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnprocessableEntity)
		return
	}
	if err != nil {
		respondErr(w, err)
		return
	}
	respond(w, pp, http.StatusOK)

}
func (h *handler) getAllPostz(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	q := r.URL.Query()
	last := q.Get("last")
	search := q.Get("search")
	before, _ := strconv.ParseInt(q.Get("before"), 10, 64)

	pp, err := h.GetAllPostz(ctx, before, last, search)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnprocessableEntity)
		return
	}
	if err != nil {
		respondErr(w, err)
		return
	}
	respond(w, pp, http.StatusOK)

}
func (h *handler) getAllTags(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	pp, err := h.GetAllTags(ctx)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnprocessableEntity)
		return
	}
	if err != nil {
		respondErr(w, err)
		return
	}
	respond(w, pp, http.StatusOK)

}
func (h *handler) searchTags(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	search := way.Param(ctx, "tag")

	fmt.Print(search, "search")
	pp, err := h.SearchTags(ctx, search)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnprocessableEntity)
		return
	}
	if err != nil {
		respondErr(w, err)
		return
	}
	respond(w, pp, http.StatusOK)

}
func (h *handler) uploadPost(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(32 << 20)
	file, header, err := r.FormFile("upfile")
	pid := r.FormValue("content")
	fmt.Println(pid, "jkljlkjkljkljlk")
	if err != nil {
		fmt.Println("err upload", err)
		return
	}
	defer r.Body.Close()
	filename := header.Filename
	uploadObjectPost(file, "originals/300x300_1000x1000_1500x1500/"+header.Filename)
	uu, err := h.UploadPost(r.Context(), filename, pid)
	if err != nil {
		respondErr(w, err)
		return
	}
	//fileBytes, _ := ioutil.ReadAll(file)
	fmt.Println(filename)
	respond(w, uu, http.StatusOK)
}
func (h *handler) uploadmultiPost(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(32 << 20)
	formdata := r.MultipartForm
	files := formdata.File["upfile"] // grab the filenames
	//files, header, err := r.FormFile("upfile")
	pid := r.FormValue("content")
	fmt.Println(pid, "jkljlkjkljkljlk")

	for i, _ := range files { // loop through the files one by one
		file, err := files[i].Open()
		uploadObjectPost(file, "originals/300x300_1000x1000_1500x1500/"+files[i].Filename)
		defer file.Close()
		if err != nil {
			fmt.Fprintln(w, err)
			return
		}

	}

	defer r.Body.Close()

	uu, err := h.UploadPostMulti(r.Context(), files, pid)
	if err != nil {
		respondErr(w, err)
		return
	}
	//fileBytes, _ := ioutil.ReadAll(file)

	respond(w, uu, http.StatusOK)
}
func (h *handler) uploadPostSh(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(32 << 20)
	file, header, err := r.FormFile("upfile")
	pid := r.FormValue("content")

	if err != nil {
		fmt.Println("err upload", err)
		return
	}
	defer r.Body.Close()
	filename := header.Filename
	uploadObjectPost(file, "originals/300x300_1000x1000_1500x1500/"+header.Filename)
	uu, err := h.UploadPost(r.Context(), filename, pid)
	if err != nil {
		respondErr(w, err)
		return
	}
	//fileBytes, _ := ioutil.ReadAll(file)
	fmt.Println(filename)
	respond(w, uu, http.StatusOK)
}
func (h *handler) post(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	q := r.URL.Query()
	postID, _ := strconv.ParseInt(way.Param(ctx, "id"), 10, 64)
	last, _ := strconv.Atoi(q.Get("last"))
	before, _ := strconv.ParseInt(q.Get("before"), 10, 64)
	fmt.Println(postID)
	fmt.Println(last)
	pp, err := h.Post(ctx, postID, last, before)

	if err != nil {
		respondErr(w, err)
		return
	}
	respond(w, pp, http.StatusOK)

}
func (h *handler) updatepost(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	//q := r.URL.Query()
	postID, _ := strconv.ParseInt(way.Param(ctx, "id"), 10, 64)

	pp, err := h.Updatepost(ctx, postID)

	if err != nil {
		respondErr(w, err)
		return
	}
	respond(w, pp, http.StatusOK)

}

func (h *handler) mimestPt(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	pp, err := h.MimesPp(ctx)

	if err != nil {
		respondErr(w, err)
		return
	}
	respond(w, pp, http.StatusOK)

}
func (h *handler) orders(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	//q := r.URL.Query()
	postID, _ := strconv.ParseInt(way.Param(ctx, "id"), 10, 64)

	pp, err := h.Orders(ctx, postID)

	if err != nil {
		respondErr(w, err)
		return
	}
	respond(w, pp, http.StatusOK)

}
func (h *handler) perfom(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	pp, err := h.Perfom(ctx)

	if err != nil {
		respondErr(w, err)
		return
	}
	respond(w, pp, http.StatusOK)

}
func (h *handler) perfompr(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	q := r.URL.Query()

	btn, err := strconv.ParseBool(q.Get("project"))
	uids, err := strconv.ParseInt(q.Get("uid"), 10, 64)
	pp, err := h.PerfomProj(ctx, btn, uids)

	if err != nil {
		respondErr(w, err)
		return
	}
	respond(w, pp, http.StatusOK)

}

func (h *handler) deleted(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	//q := r.URL.Query()
	postID, _ := strconv.ParseInt(way.Param(ctx, "id"), 10, 64)
	fmt.Println(postID, "postID")
	pp, err := h.Deleted(ctx, postID)

	if err != nil {
		respondErr(w, err)
		return
	}
	respond(w, pp, http.StatusOK)

}
func (h *handler) tagimg(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	q := r.URL.Query()

	tag := q.Get("value")

	pp, err := h.Tagimg(ctx, tag)

	if err != nil {
		respondErr(w, err)
		return
	}
	respond(w, pp, http.StatusOK)

}
