package service

import (
	"bytes"
	"fmt"
	"net/url"
	"regexp"
	"strings"
	"text/template"

	"github.com/lib/pq"
)

const (
	minPageSize = 1
	defaultPage = 10
	maxPageSize = 99
)

var reMentions = regexp.MustCompile(`\B@([a-zA-Z][a-zA-Z0-9_-]{0,17})`)
var reUUID = regexp.MustCompile("^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$")
var queriesCashes = make(map[string]*template.Template)

func isUniqueViolation(err error) bool {
	pqerr, ok := err.(*pq.Error)
	return ok && pqerr.Code == "23505"
}
func isUniquePostViolation(err error) bool {
	pqerr, ok := err.(*pq.Error)
	return ok && pqerr.Code == "23503"
}
func buildQuery(text string, data map[string]interface{}) (string, []interface{}, error) {
	t, ok := queriesCashes[text]
	if !ok {
		var err error
		t, err = template.New("query").Parse(text)
		if err != nil {
			return "", nil, fmt.Errorf("coudnt: %v", err)
		}
		queriesCashes[text] = t
	}
	var wr bytes.Buffer
	if err := t.Execute(&wr, data); err != nil {
		return "", nil, fmt.Errorf("coudnt apply query data: %v", err)
	}
	query := wr.String()
	args := []interface{}{}
	for key, val := range data {
		if !strings.Contains(query, "@"+key) {
			continue
		}
		args = append(args, val)
		query = strings.Replace(query, "@"+key, fmt.Sprintf("$%d", len(args)), -1)
	}
	return query, args, nil

}
func normalizePageSize(i int) int {
	if i == 0 {
		return defaultPage
	}
	if i < minPageSize {
		return minPageSize
	}
	if i > maxPageSize {
		return maxPageSize
	}
	return i
}
func collectMentions(s string) []string {
	m := map[string]struct{}{}
	u := []string{}
	for _, submatch := range reMentions.FindAllStringSubmatch(s, -1) {
		val := submatch[1]
		if _, ok := m[val]; !ok {
			m[val] = struct{}{}
			u = append(u, val)
		}
	}
	return u
}

func cloneURL(u *url.URL) *url.URL {
	if u == nil {
		return nil
	}
	u2 := new(url.URL)
	*u2 = *u
	if u.User != nil {
		u2.User = new(url.Userinfo)
		*u2.User = *u.User
	}
	return u2
}
