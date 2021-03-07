package handler

import (
	"encoding/json"
	"fmt"
	"mime"
	"net/http"
	"strconv"

	"github.com/matryer/way"
)

type Hcom struct {
	PID      int64
	Value    string
	Title    string
	Username string
}

func (h *handler) createComment(w http.ResponseWriter, r *http.Request) {
	var in Hcom
	ctx := r.Context()
	defer r.Body.Close()
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	pid := way.Param(ctx, "id")
	PID, _ := strconv.ParseInt(pid, 0, 64)
	ti, err := h.CrateCmmment(ctx, PID, in.Value, in.Title, in.Username)
	if err != nil {
		respondErr(w, err)
		return
	}
	respond(w, ti, http.StatusOK)
}
func (h *handler) allcomment(w http.ResponseWriter, r *http.Request) {
	if a, _, err := mime.ParseMediaType(r.Header.Get("Accept")); err == nil && a == "text/event-stream" {
		h.commentStream(w, r)
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
	PID, _ := strconv.ParseInt(pid, 0, 64)
	fmt.Println(PID)
	ti, err := h.GetAll(ctx, PID)
	fmt.Println("huhi")
	if err != nil {
		respondErr(w, err)
		return
	}
	respond(w, ti, http.StatusOK)
}
func (h *handler) updateCmment(w http.ResponseWriter, r *http.Request) {
	var in Hcom
	ctx := r.Context()
	defer r.Body.Close()
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	cid := way.Param(ctx, "com_id")
	Cid, _ := strconv.ParseInt(cid, 0, 64)
	ti, err := h.UpdateCom(ctx, Cid, in.Value, in.Title)
	if err != nil {
		respondErr(w, err)
		return
	}
	respond(w, ti, http.StatusOK)

}
func (h *handler) commentStream(w http.ResponseWriter, r *http.Request) {
	f, ok := w.(http.Flusher)
	if !ok {
		respondErr(w, nil)
		return
	}

	ctx := r.Context()
	fmt.Println(ctx, "contex")
	postID := way.Param(ctx, "id")
	//Pid, _ := strconv.ParseInt(postID, 0, 64)
	cc, err := h.CommentStream(ctx, postID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnprocessableEntity)
		return
	}

	if err != nil {
		respondErr(w, err)
		return
	}

	header := w.Header()
	header.Set("Cache-Control", "no-cache")
	header.Set("Connection", "keep-alive")
	header.Set("Content-Type", "text/event-stream; charset=utf-8")

	for c := range cc {
		writeSSE(w, c)
		f.Flush()
	}
}
