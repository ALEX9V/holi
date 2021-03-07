package handler

import (
	"encoding/json"
	"fmt"
	"mime"
	"net/http"
	"path"
	"social/internal/service"
	"strconv"
	"strings"

	"github.com/matryer/way"
)

type Mes struct {
	UID2    string
	Message string
	Value   string
}

func (h *handler) message(w http.ResponseWriter, r *http.Request) {
	var in Mes

	ctx := r.Context()

	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	fmt.Println(in.Message, "Message")
	fmt.Println(in.Value, "Message")
	filename := path.Base(in.Value)
	fmt.Println("Downloading ", in.Value, " to ", filename)
	var Value = in.Value
	ua := r.Header.Get("authorization")
	replacer := strings.NewReplacer("Bearer ", "")
	PPvmt09 := replacer.Replace(ua)
	pp, err := h.CrateMessange(ctx, in.UID2, in.Message, Value, PPvmt09)
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

func (h *handler) getAllMess(w http.ResponseWriter, r *http.Request) {
	fmt.Println("shag")
	if a, _, err := mime.ParseMediaType(r.Header.Get("Accept")); err == nil && a == "text/event-stream" {
		fmt.Println("work")
		h.messageStream(w, r)
		return
	}

	ctx := r.Context()
	q := r.URL.Query()
	last, _ := strconv.Atoi(q.Get("last"))
	befores, _ := strconv.ParseInt(q.Get("before"), 10, 64)
	before := q.Get("token")
	fmt.Println(before, "getAllMess")
	reserve := way.Param(ctx, "id")
	fmt.Println("shag2")
	ua := r.Header.Get("authorization")
	replacer := strings.NewReplacer("Bearer ", "")
	PPvmt09 := replacer.Replace(ua)
	pp, err := h.GetAllMess(ctx, reserve, before, befores, last, PPvmt09)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnprocessableEntity)
		return
	}
	fmt.Println("shag3")
	if err != nil {
		respondErr(w, err)
		return
	}
	respond(w, pp, http.StatusOK)

}
func (h *handler) getAllMes(w http.ResponseWriter, r *http.Request) {
	fmt.Println("shag")
	if a, _, err := mime.ParseMediaType(r.Header.Get("Accept")); err == nil && a == "text/event-stream" {
		fmt.Println("work")
		h.messageStream(w, r)
		return
	}

	ctx := r.Context()
	q := r.URL.Query()
	before := q.Get("token")
	fmt.Println(before, "getAllMess")
	reserve := way.Param(ctx, "id")
	fmt.Println("shag2")
	ua := r.Header.Get("authorization")
	replacer := strings.NewReplacer("Bearer ", "")
	PPvmt09 := replacer.Replace(ua)
	pp, err := h.GetAllMes(ctx, reserve, before, PPvmt09)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnprocessableEntity)
		return
	}
	fmt.Println("shag3")
	if err != nil {
		respondErr(w, err)
		return
	}
	respond(w, pp, http.StatusOK)

}
func (h *handler) getAllMesGp(w http.ResponseWriter, r *http.Request) {

	ctx := r.Context()
	gid := way.Param(ctx, "id")
	fmt.Println("shag2")
	ua := r.Header.Get("authorization")
	replacer := strings.NewReplacer("Bearer ", "")
	PPvmt09 := replacer.Replace(ua)
	pp, err := h.GetAllMesGp(ctx, gid, PPvmt09)

	if err != nil {
		http.Error(w, err.Error(), http.StatusUnprocessableEntity)
		return
	}
	fmt.Println("shag3")
	if err != nil {
		respondErr(w, err)
		return
	}
	respond(w, pp, http.StatusOK)

}

func (h *handler) timelineM(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	before, _ := strconv.ParseInt(q.Get("before"), 10, 64)
	ctx := r.Context()
	fmt.Println(before, "beforebeforebefore")
	ua := r.Header.Get("authorization")
	replacer := strings.NewReplacer("Bearer ", "")
	PPvmt09 := replacer.Replace(ua)
	pp, err := h.Timelinemess(ctx, before, PPvmt09)
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
func (h *handler) messageStream(w http.ResponseWriter, r *http.Request) {
	f, ok := w.(http.Flusher)
	if !ok {
		respondErr(w, nil)
		return
	}
	q := r.URL.Query()
	before := q.Get("token")
	fmt.Println(before, "messageStream")

	//ctx := r.Context()
	fmt.Println(r.URL, "contex")

	//Pid, _ := strconv.ParseInt(postID, 0, 64)
	ua := r.Header.Get("authorization")
	replacer := strings.NewReplacer("Bearer ", "")
	PPvmt09 := replacer.Replace(ua)
	mm, err := h.MessageStream(r.Context(), before, PPvmt09)
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
func (h *handler) markMessAsRead(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	notificationID := way.Param(ctx, "id")
	ua := r.Header.Get("authorization")
	replacer := strings.NewReplacer("Bearer ", "")
	PPvmt09 := replacer.Replace(ua)
	err := h.MarkMessAsRead(ctx, notificationID, PPvmt09)
	if err == service.ErrUnauthenticated {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	if err == service.ErrInvalidNotificationID {
		http.Error(w, err.Error(), http.StatusUnprocessableEntity)
		return
	}

	if err != nil {
		respondErr(w, err)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
func (h *handler) gpmessage(w http.ResponseWriter, r *http.Request) {
	var in Mes

	ctx := r.Context()

	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	Gid := way.Param(ctx, "id")
	ua := r.Header.Get("authorization")
	replacer := strings.NewReplacer("Bearer ", "")
	PPvmt09 := replacer.Replace(ua)
	pp, err := h.CreateGpMessange(ctx, Gid, in.Message, PPvmt09)
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
