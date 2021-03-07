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

type createUserInput struct {
	Email    string
	Username string
	Pass     string
	Ln       string
	Fn       string
}
type createUserInputPost struct {
	Ager  string
	Op    string
	Opi   string
	Sci   string
	Citys string
	Pol   string
	Ln    string
	Fn    string
	Olp   string
	Nwp   string
}

func (h *handler) user(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	username := way.Param(ctx, "username")
	u, err := h.User(ctx, username)
	if err == service.ErrInvalidUsername {
		http.Error(w, err.Error(), http.StatusUnprocessableEntity)
		return
	}
	if err == service.ErrUserNoFound {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	if err != nil {
		respondErr(w, err)
		return
	}
	respond(w, u, http.StatusOK)
}

func (h *handler) toggleFollow(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	username := way.Param(ctx, "username")
	out, err := h.ToggleFollow(ctx, username)
	if err == service.ErrUnauthenticated {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}
	if err == service.ErrInvalidUser {
		http.Error(w, err.Error(), http.StatusUnprocessableEntity)
		return
	}
	if err == service.ErrUserNoFound {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}
	if err == service.ErrForbiddenFollow {
		http.Error(w, err.Error(), http.StatusForbidden)
		return
	}
	if err != nil {
		respondErr(w, err)
		return
	}
	respond(w, out, http.StatusOK)

}
func (h *handler) statusProjectUser(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	q := r.URL.Query()
	strUirl, _ := strconv.ParseBool(q.Get("value"))
	fmt.Println(strUirl, "strUirl")
	out, err := h.StPrtUser(ctx, strUirl)
	if err == service.ErrUnauthenticated {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}
	if err == service.ErrInvalidUser {
		http.Error(w, err.Error(), http.StatusUnprocessableEntity)
		return
	}
	if err == service.ErrUserNoFound {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}
	if err == service.ErrForbiddenFollow {
		http.Error(w, err.Error(), http.StatusForbidden)
		return
	}
	if err != nil {
		respondErr(w, err)
		return
	}
	respond(w, out, http.StatusOK)

}
func (h *handler) createUser(w http.ResponseWriter, r *http.Request) {
	fmt.Println("user handler")
	var in createUserInput
	defer r.Body.Close()
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	fmt.Println(in.Fn, in.Ln, "in.Nm, in.Ln")
	err := h.CreateUser(r.Context(), in.Email, in.Username, in.Pass, in.Fn, in.Ln)

	if err == service.ErrInvalidEmail || err == service.ErrInvalidUsername {
		http.Error(w, err.Error(), http.StatusUnprocessableEntity)
		return
	}
	if err != nil {
		respondErr(w, err)
		return
	}
	fmt.Println("user handler")
	w.WriteHeader(http.StatusNoContent)

}
func (h *handler) users(w http.ResponseWriter, r *http.Request) {

	q := r.URL.Query()
	search := q.Get("search")
	first, _ := strconv.Atoi(q.Get("first"))
	after := q.Get("after")
	uu, err := h.Users(r.Context(), search, first, after)
	if err != nil {
		respondErr(w, err)
		return
	}
	respond(w, uu, http.StatusOK)

}
func (h *handler) followers(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	q := r.URL.Query()
	username := way.Param(ctx, "username")
	first, _ := strconv.Atoi(q.Get("first"))
	after := q.Get("after")
	uu, err := h.Followers(ctx, username, first, after)
	if err == service.ErrInvalidUsername {
		http.Error(w, err.Error(), http.StatusUnprocessableEntity)
		return
	}
	if err != nil {
		respondErr(w, err)
		return
	}
	respond(w, uu, http.StatusOK)

}

func (h *handler) followees(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	q := r.URL.Query()
	username := way.Param(ctx, "username")
	first, _ := strconv.Atoi(q.Get("first"))
	after := q.Get("after")
	uu, err := h.Followees(ctx, username, first, after)
	if err == service.ErrInvalidUsername {
		http.Error(w, err.Error(), http.StatusUnprocessableEntity)
		return
	}
	if err != nil {
		respondErr(w, err)
		return
	}
	respond(w, uu, http.StatusOK)

}

func (h *handler) updateAvatar(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(32 << 20)
	file, header, err := r.FormFile("upfile")
	if err != nil {
		fmt.Println("err upload", err)
		return
	}
	defer r.Body.Close()
	filename := header.Filename
	uploadObject(file, header.Filename)
	uu, err := h.UploadAvatar(r.Context(), filename)
	if err != nil {
		respondErr(w, err)
		return
	}
	//fileBytes, _ := ioutil.ReadAll(file)
	fmt.Println(filename)
	respond(w, uu, http.StatusOK)

}
func (h *handler) updatePostim(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(32 << 20)
	file, header, err := r.FormFile("upfile")
	if err != nil {
		fmt.Println("err upload", err)
		return
	}
	ctx := r.Context()
	postID, _ := strconv.ParseInt(way.Param(ctx, "id"), 10, 64)
	defer r.Body.Close()
	filename := header.Filename
	uploadObject(file, header.Filename)
	uu, err := h.UploadPostIm(r.Context(), filename, postID)
	if err != nil {
		respondErr(w, err)
		return
	}
	//fileBytes, _ := ioutil.ReadAll(file)
	fmt.Println(filename)
	respond(w, uu, http.StatusOK)

}
func (h *handler) updateUser(w http.ResponseWriter, r *http.Request) {
	var in createUserInputPost
	defer r.Body.Close()
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	fmt.Println(in.Ager, in.Citys, in.Op, in.Opi, in.Pol, in.Sci, in.Fn, in.Ln)
	defer r.Body.Close()
	ua := r.Header.Get("authorization")
	replacer := strings.NewReplacer("Bearer ", "")
	UUvbt13 := replacer.Replace(ua)
	err := h.UsersShSetting(r.Context(), in.Ager, in.Citys, in.Op, in.Opi, in.Pol, in.Sci, in.Fn, in.Ln, in.Olp, in.Nwp, UUvbt13)
	if err != nil {
		respondErr(w, err)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
func (h *handler) mimestUs(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	pp, err := h.MimesUs(ctx)

	if err != nil {
		respondErr(w, err)
		return
	}
	respond(w, pp, http.StatusOK)

}
