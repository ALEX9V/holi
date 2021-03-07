package handler

import (
	"encoding/json"
	"fmt"
	"mime"
	"net/http"
	"social/internal/service"
	"strconv"
	"strings"

	"github.com/matryer/way"
)

type Grouph struct {
	ID     string
	UID    string
	Theme  string
	Opis   string
	PID    string
	Closer string
	Pass   string
}
type Story struct {
	PID      string
	GID      string
	Value    string
	Title    string
	Username string
}

func (h *handler) group(w http.ResponseWriter, r *http.Request) {
	var in Grouph

	ctx := r.Context()

	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	ua := r.Header.Get("authorization")
	replacer := strings.NewReplacer("Bearer ", "")
	out := replacer.Replace(ua)
	in.Closer = "open"
	pp, err := h.CreateGroup(ctx, in.Theme, in.Opis, in.PID, in.Closer, in.Pass, out)
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
func (h *handler) showGp(w http.ResponseWriter, r *http.Request) {

	ctx := r.Context()
	PID := way.Param(ctx, "id")
	ua := r.Header.Get("authorization")
	replacer := strings.NewReplacer("Bearer ", "")
	out := replacer.Replace(ua)
	pp, err := h.ShowGp(ctx, PID, out)
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
func (h *handler) gpStream(w http.ResponseWriter, r *http.Request) {
	f, ok := w.(http.Flusher)
	if !ok {
		respondErr(w, nil)
		return
	}
	q := r.URL.Query()
	before := q.Get("token")
	fmt.Println(before, "messageStream")
	ctx := r.Context()
	GID := way.Param(ctx, "id")
	//ctx := r.Context()
	fmt.Println(r.URL, "contex")

	//Pid, _ := strconv.ParseInt(postID, 0, 64)
	mm, err := h.GpStream(r.Context(), before, GID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnprocessableEntity)
		return
	}

	if err != nil {
		respondErr(w, err)
		fmt.Println("error")
		return
	}

	header := w.Header()
	header.Set("Cache-Control", "no-cache")
	header.Set("Connection", "keep-alive")
	header.Set("Content-Type", "text/event-stream; charset=utf-8")

	for m := range mm {
		writeSSE(w, m)
		f.Flush()
	}
}
func (h *handler) chUg(w http.ResponseWriter, r *http.Request) {

	ctx := r.Context()
	PID := way.Param(ctx, "id")
	ua := r.Header.Get("authorization")
	replacer := strings.NewReplacer("Bearer ", "")
	out := replacer.Replace(ua)
	pp, err := h.ChUg(ctx, PID, out)
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
func (h *handler) groups(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	q := r.URL.Query()
	ua := r.Header.Get("authorization")
	replacer := strings.NewReplacer("Bearer ", "")
	out := replacer.Replace(ua)
	fmt.Println(out, "tokenss")
	before, _ := strconv.ParseInt(q.Get("before"), 10, 64)
	fmt.Println(before, "beforebefore")
	pp, err := h.GetAllGroup(ctx, before, out)
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
func (h *handler) createStroryGp(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(32 << 20)
	formdata := r.MultipartForm
	files := formdata.File["upfile"] // grab the filenames
	//files, header, err := r.FormFile("upfile")
	fmt.Println(files, "filesfiles")
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

	ctx := r.Context()
	GID := way.Param(ctx, "id")

	ua := r.Header.Get("authorization")
	replacer := strings.NewReplacer("Bearer ", "")
	out := replacer.Replace(ua)
	fmt.Println(r.FormValue("username"), "r.FormValue()")
	pp, err := h.CreateStoryGp(ctx, GID, "0", "", r.FormValue("content"), r.FormValue("username"), out, files)
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
func (h *handler) vidGp(w http.ResponseWriter, r *http.Request) {
	var in Story

	ctx := r.Context()
	Gid := way.Param(ctx, "id")
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	ua := r.Header.Get("authorization")
	replacer := strings.NewReplacer("Bearer ", "")
	out := replacer.Replace(ua)
	pp, err := h.VidGp(ctx, Gid, in.Value, out)
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
func (h *handler) getvidGp(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	ctx := r.Context()
	Gid := way.Param(ctx, "id")
	befores, _ := strconv.ParseInt(q.Get("before"), 10, 64)
	fmt.Println(befores, "beforee")
	fmt.Println("GetVidGp")
	ua := r.Header.Get("authorization")
	replacer := strings.NewReplacer("Bearer ", "")
	out := replacer.Replace(ua)
	pp, err := h.GetVidGp(ctx, Gid, befores, out)
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
func (h *handler) allStGp(w http.ResponseWriter, r *http.Request) {
	fmt.Println("shag")
	if a, _, err := mime.ParseMediaType(r.Header.Get("Accept")); err == nil && a == "text/event-stream" {
		fmt.Println("work")
		h.gpStream(w, r)
		return
	}
	//	var in Hcom
	ctx := r.Context()
	fmt.Println("huhi")
	//	defer r.Body.Close()
	//	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
	//	http.Error(w, err.Error(), http.StatusBadRequest)
	//	return
	//	}
	pid := way.Param(ctx, "id")
	Pid, _ := strconv.ParseInt(pid, 0, 64)
	fmt.Println(Pid)
	ua := r.Header.Get("authorization")
	replacer := strings.NewReplacer("Bearer ", "")
	out := replacer.Replace(ua)
	ti, err := h.GetAllStGp(ctx, Pid, out)
	fmt.Println("huhi")
	if err != nil {
		respondErr(w, err)
		return
	}
	respond(w, ti, http.StatusOK)
}
func (h *handler) regUsGr(w http.ResponseWriter, r *http.Request) {
	var in Grouph

	ctx := r.Context()
	Gid := way.Param(ctx, "id")
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	ua := r.Header.Get("authorization")
	replacer := strings.NewReplacer("Bearer ", "")
	out := replacer.Replace(ua)
	pp, err := h.RegUsGr(ctx, Gid, in.Pass, out)
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
func (h *handler) listOfUser(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	Gid := way.Param(ctx, "id")
	fmt.Println(Gid, "pidpid")
	ua := r.Header.Get("authorization")
	replacer := strings.NewReplacer("Bearer ", "")
	out := replacer.Replace(ua)
	pp, err := h.ListofUser(ctx, Gid, out)
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
