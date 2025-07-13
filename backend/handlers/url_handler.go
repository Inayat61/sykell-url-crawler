// backend/handlers/url_handler.go
package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"sykell-url-crawler/backend/database"
	"sykell-url-crawler/backend/models"
)

// AddURLRequest represents the request body for adding a new URL.
type AddURLRequest struct {
	URL string `json:"url" binding:"required,url"` // Validate that it's a required URL
}

// AddURL handles the request to add a new URL for analysis.
func AddURL(c *gin.Context) {
	var req AddURLRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if URL already exists
	var existingURL models.URLAnalysis
	if result := database.DB.Where("url = ?", req.URL).First(&existingURL); result.Error == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "URL already exists", "id": existingURL.ID})
		return
	}

	urlAnalysis := models.URLAnalysis{
		URL:       req.URL,
		Status:    models.StatusQueued, // Initially set to 'queued'
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	if result := database.DB.Create(&urlAnalysis); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save URL"})
		return
	}

	c.JSON(http.StatusCreated, urlAnalysis)
}

// GetURLs handles the request to retrieve all stored URL analyses.
func GetURLs(c *gin.Context) {
	var urls []models.URLAnalysis
	if result := database.DB.Find(&urls); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve URLs"})
		return
	}

	c.JSON(http.StatusOK, urls)
}

// GetURLByID handles the request to retrieve a single URL analysis by ID.
func GetURLByID(c *gin.Context) {
	id := c.Param("id") // Get ID from URL parameter

	var urlAnalysis models.URLAnalysis
	if result := database.DB.First(&urlAnalysis, id); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "URL not found"})
		return
	}

	c.JSON(http.StatusOK, urlAnalysis)
}

// NOTE: We'll add Start/Stop/Delete/Re-run handlers later,
// as they involve more complex asynchronous processing or bulk operations.