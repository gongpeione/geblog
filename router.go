package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func routerInit() {

	router.LoadHTMLGlob("./StaticTemplate/*")

	api := router.Group("/api")
	{
		admin := api.Group("/admin")
		admin.Use(AuthRequired())
		{
			admin.GET("/login", func(c *gin.Context) {
				c.String(200, "login")
			})
		}

		api.GET("/", func(c *gin.Context) {

		})
	}

	router.GET("/", func(c *gin.Context) {
		c.String(200, "package main")
	})

	router.NoRoute(func(c *gin.Context) {
		c.HTML(http.StatusOK, "404.html", gin.H{
			"title": "Users",
		})
	})
}

func AuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		log.Println("MMMMMMMMMMMMMM")
		c.Next()
	}
}
