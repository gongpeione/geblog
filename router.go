package main

import (
	"log"

	"github.com/gin-gonic/gin"
)

func routerInit() {

	admin := router.Group("/admin")
	admin.Use()
	{
		admin.GET("/login", func(c *gin.Context) {
			c.String(200, "Login")
		})
	}

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
}

func AuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		log.Println("MMMMMMMMMMMMMM")
		c.Next()
	}
}
