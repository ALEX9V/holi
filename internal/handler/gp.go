package handler

import (
	"fmt"
	"mime"
	"net/http"
	"social/internal/service"
	"strconv"
)

func (h *handler) gps(w http.ResponseWriter, r *http.Request) {
	fmt.Println(r.Header)
	if a, _, err := mime.ParseMediaType(r.Header.Get("Accept")); err == nil && a == "text/event-stream" {
		fmt.Println("work")
		h.gpStream(w, r)
		return
	}

	q := r.URL.Query()
	last, _ := strconv.Atoi(q.Get("last"))
	before := q.Get("before")
	nn, err := h.Gps(r.Context(), last, before)
	if err == service.ErrUnauthenticated {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	if err == service.ErrInvalidGroupID {
		http.Error(w, err.Error(), http.StatusUnprocessableEntity)
		return
	}

	if err != nil {
		respondErr(w, err)
		return
	}

	respond(w, nn, http.StatusOK)
}
