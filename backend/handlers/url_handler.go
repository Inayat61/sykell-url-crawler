// backend/handlers/url_handler.go
package handlers

import (
	"fmt" // Import fmt for Sprintf
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"sykell-url-crawler/backend/crawler"
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

// TriggerCrawl handles the request to start a crawl for a specific URL analysis entry.
func TriggerCrawl(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid URL ID"})
		return
	}

	var urlAnalysis models.URLAnalysis
	if result := database.DB.First(&urlAnalysis, id); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "URL not found"})
		return
	}

	// Check if already running or done/error and prevent re-triggering immediately
	if urlAnalysis.Status == models.StatusRunning {
		c.JSON(http.StatusConflict, gin.H{"error": "Crawl already running for this URL"})
		return
	}

	// Update status to running and save
	urlAnalysis.Status = models.StatusRunning
	urlAnalysis.UpdatedAt = time.Now()
	if result := database.DB.Save(&urlAnalysis); result.Error != nil {
		log.Printf("Error updating URL status to running for ID %d: %v", id, result.Error)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update URL status"})
		return
	}

	// Start the crawl in a goroutine to not block the API response
	go startCrawl(urlAnalysis.ID, urlAnalysis.URL)

	c.JSON(http.StatusOK, gin.H{"message": "Crawl triggered successfully", "id": urlAnalysis.ID, "status": urlAnalysis.Status})
}


// startCrawl performs the actual crawling and updates the database.
func startCrawl(id int, targetURL string) {
	log.Printf("Starting crawl for URL ID %d: %s", id, targetURL)

	// Fetch the URLAnalysis again inside the goroutine to ensure we have the latest state
	var urlAnalysis models.URLAnalysis
	if result := database.DB.First(&urlAnalysis, id); result.Error != nil {
		log.Printf("Failed to find URLAnalysis with ID %d in goroutine: %v", id, result.Error)
		return
	}

	// Perform the actual analysis
	crawledData, err := crawler.AnalyzePage(targetURL)
	if err != nil {
		log.Printf("Crawl failed for URL ID %d (%s): %v", id, targetURL, err)
		urlAnalysis.Status = models.StatusError
		urlAnalysis.PageTitle = "Crawl Error" // Simple indicator for error
		// Optionally store the error message in a new field in URLAnalysis if needed for frontend display
	} else {
		log.Printf("Crawl finished for URL ID %d (%s) successfully", id, targetURL)
		urlAnalysis.Status = models.StatusDone
		urlAnalysis.HTMLVersion = crawledData.HTMLVersion
		urlAnalysis.PageTitle = crawledData.PageTitle
		urlAnalysis.HeadingCounts = crawledData.HeadingCounts
		urlAnalysis.InternalLinks = crawledData.InternalLinks
		urlAnalysis.ExternalLinks = crawledData.ExternalLinks
		urlAnalysis.InaccessibleLinks = crawledData.InaccessibleLinks
		urlAnalysis.HasLoginForm = crawledData.HasLoginForm
	}

	urlAnalysis.UpdatedAt = time.Now()
	if result := database.DB.Save(&urlAnalysis); result.Error != nil {
		log.Printf("Failed to save crawl results for ID %d: %v", id, result.Error)
	}
}

// BulkTriggerCrawlRequest represents the request body for bulk crawl.
type BulkTriggerCrawlRequest struct {
	IDs []int `json:"ids" binding:"required"` // List of URL IDs to crawl
}

// BulkTriggerCrawl handles the request to start crawls for multiple URL analysis entries.
func BulkTriggerCrawl(c *gin.Context) {
	var req BulkTriggerCrawlRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if len(req.IDs) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No IDs provided for bulk crawl"})
		return
	}

	var updatedCount int
	var errors []string

	for _, id := range req.IDs {
		var urlAnalysis models.URLAnalysis
		result := database.DB.First(&urlAnalysis, id)
		if result.Error != nil {
			errors = append(errors, fmt.Sprintf("URL ID %d not found or database error: %v", id, result.Error))
			continue
		}

		if urlAnalysis.Status == models.StatusRunning {
			errors = append(errors, fmt.Sprintf("Crawl for URL ID %d is already running", id))
			continue
		}

		// Update status to running and save
		urlAnalysis.Status = models.StatusRunning
		urlAnalysis.UpdatedAt = time.Now()
		if result := database.DB.Save(&urlAnalysis); result.Error != nil {
			errors = append(errors, fmt.Sprintf("Failed to update URL ID %d status to running: %v", id, result.Error))
			continue
		}

		// Start the crawl in a goroutine
		go startCrawl(urlAnalysis.ID, urlAnalysis.URL)
		updatedCount++
	}

	if len(errors) > 0 {
		c.JSON(http.StatusMultiStatus, gin.H{ // 207 Multi-Status if some succeeded, some failed
			"message":       fmt.Sprintf("%d crawls triggered, with %d errors.", updatedCount, len(errors)),
			"triggered":     updatedCount,
			"errors_details": errors,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":   fmt.Sprintf("%d crawls triggered successfully.", updatedCount),
		"triggered": updatedCount,
	})
}