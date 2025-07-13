package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"sykell-url-crawler/backend/database"
	"sykell-url-crawler/backend/handlers"
)

func main() {
	gin.SetMode(gin.DebugMode)

	database.Connect()

	r := gin.Default()

	// CORS middleware (as before)
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	api := r.Group("/api")
	{
		api.GET("/ping", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"message": "pong",
			})
		})

		// URL Management Endpoints
		api.POST("/urls", handlers.AddURL)
		api.GET("/urls", handlers.GetURLs)
		api.GET("/urls/:id", handlers.GetURLByID)

		// Endpoint to trigger single crawl
		api.POST("/urls/:id/crawl", handlers.TriggerCrawl)

		// New: Endpoint to trigger bulk crawl
		api.POST("/urls/bulk-crawl", handlers.BulkTriggerCrawl)
	}

	port := ":8080"
	log.Printf("Server starting on port %s", port)
	if err := r.Run(port); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}