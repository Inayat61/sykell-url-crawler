// backend/main.go
package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	// Set Gin to release mode in production, debug mode for development
	gin.SetMode(gin.DebugMode) // Or gin.ReleaseMode for production

	r := gin.Default() // Creates a Gin router with default middleware (logger and recovery)

	// Basic "Hello World" endpoint to test the server
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	// Start the server
	port := ":8080"
	log.Printf("Server starting on port %s", port)
	if err := r.Run(port); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}