package main

import (
	"fmt"

	"github.com/gin-gonic/gin"
)

type Person struct {
	Name    string `form:"name"`
	Address string `form:"address"`
}

var router *gin.Engine

func main() {
	router = gin.Default()
	initializeRoutes()
	// route.Any("/", func(c *gin.Context) {
	// 	var person Person
	// 	if c.ShouldBindQuery(&person) == nil {
	// 		log.Println("====== Only Bind By Query String ======")
	// 		log.Println(person.Name)
	// 		log.Println(person.Address)
	// 	}
	// 	c.String(200, "Success")
	// })
	router.Run(":8085")
	fmt.Printf("hello, world\n")
}
