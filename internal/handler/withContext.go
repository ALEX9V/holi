package handler

import (
	"fmt"
	"mime/multipart"
	"time"

	//"io/ioutil"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
)

var (
	s3session *s3.S3
)

func init() {
	s3session = s3.New(session.Must(session.NewSession(&aws.Config{
		Region:      aws.String("us-east-1"),
		Credentials: credentials.NewStaticCredentials("AKIAJNJBI5AGYKCEYGGQ", "/JcQBfVwK5wnRl4qsfcS6yedV3U9nP4vl3suP2YB", ""),
	})))
}
func ListBuckets() (resp *s3.ListBucketsOutput) {
	resp, err := s3session.ListBuckets(&s3.ListBucketsInput{})
	if err != nil {
		fmt.Print("erroe", err)
	}
	return resp
}
func uploadObject(f multipart.File, filename string) (resp *s3.PutObjectOutput) {
	//f, err := os.Open(filename)
	//fmt.Print(f)
	//if err != nil {
	//	fmt.Print("error")
	//}
	fmt.Print(f)
	resp, err := s3session.PutObject(&s3.PutObjectInput{
		Body:   f,
		Bucket: aws.String("output465465465465s"),
		Key:    aws.String("originals/100x100_300x300_1000x1000/" + filename),
	})
	if err != nil {
		fmt.Print("error", err)
	}
	return resp

}
func uploadObjectPost(f multipart.File, filename string) (resp *s3.PutObjectOutput) {
	//f, err := os.Open(filename)
	//fmt.Print(f)
	//if err != nil {
	//	fmt.Print("error")
	//}
	fmt.Print(f)
	resp, err := s3session.PutObject(&s3.PutObjectInput{
		Body:   f,
		Bucket: aws.String("output465465465465s"),
		Key:    aws.String(filename),
	})
	fmt.Println(resp, "response")
	if err != nil {
		fmt.Print("error")
	}
	return resp

}
func downloadImage(filename string) {

	resp, err := s3session.GetObject(&s3.GetObjectInput{
		Bucket: aws.String("output465465465465s"),
		Key:    aws.String(filename),
	})
	if err != nil {
		fmt.Print("error")
	}
	// body, err := ioutil.ReadAll(resp.Body)
	fmt.Print(resp)
}
func getObject(filename string) (string, error) {
	resp, err := s3session.GetObjectRequest(&s3.GetObjectInput{
		Bucket: aws.String("output465465465465s"),
		Key:    aws.String(filename),
	})
	if err != nil {
		fmt.Print("error", err)
	}
	url, _ := resp.Presign(15 * time.Minute)

	fmt.Print(url)
	return url, nil

}
