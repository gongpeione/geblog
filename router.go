package main

import "github.com/gin-gonic/gin"

func initializeRoutes() {
	// router.Static("uploads/", "./public/uploads")

	admin := router.Group("/admin")
	{
		admin.GET("/login", func(c *gin.Context) {
			c.String(200, "Login")
		})
	}

	router.GET("/", func(c *gin.Context) {
		c.String(200, "package main")
	})
}
