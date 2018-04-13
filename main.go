package main

import (
	"github.com/gin-gonic/gin"
)

var router *gin.Engine

func main() {
	router = gin.Default()
	routerInit()
	router.Run(":8085")
}
