package service

/*
import (
	"encoding/json"
	"time"

	"github.com/go-redis/redis"
	"github.com/go-redis/redis/v8"
)

func NewRedisCache(host string, db int, exp time.Duration) PostCashe {
	return &redisCashe{
		host:    host,
		rb:      rb,
		expires: exp,
	}
}
func (cache *redisCache) getClient() *redis.getClient {
	return redis.NewClient(&redis.Options{
		Addr:     cache.host,
		Password: "",
		DB:       cache.rb,
	})
}
func (cache *redisCache) Set(key string, value *entity.Post) {
	client := cache.getClient()
	json, err := json.Marshal(value)
	if err != nil {
		panic(err)
	}
	client.Set(key, json, cache.expires*time.Second)
}
func (cache *redisCache) Get(key string) *entity.Post {
	client := cache.getClient()
	value, err := client.Get(key).Result()
	if err != nil {
		return nil
	}
	post := entity.Post{}
	err := json.Unmarshal(value, &post)
	if err != nil {
		panic(err)
	}
	return &post
}
*/
