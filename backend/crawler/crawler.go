package crawler

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/PuerkitoBio/goquery"
	"sykell-url-crawler/backend/models"
)


func AnalyzePage(targetURL string) (models.URLAnalysis, error) {
	analysis := models.URLAnalysis{
		URL:             targetURL,
		Status:          models.StatusError, 
		HeadingCounts:   models.HeadingCounts{},
		InaccessibleLinks: models.BrokenLinks{},
	}

	// 1. Fetch the page content
	resp, err := http.Get(targetURL)
	if err != nil {
		return analysis, fmt.Errorf("failed to fetch URL %s: %w", targetURL, err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		analysis.Status = models.StatusError
		analysis.PageTitle = fmt.Sprintf("Error: HTTP Status %d", resp.StatusCode)
		return analysis, fmt.Errorf("HTTP status error for %s: %d", targetURL, resp.StatusCode)
	}

	// Read the response body for HTML parsing
	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return analysis, fmt.Errorf("failed to read response body for %s: %w", targetURL, err)
	}
	bodyReader := strings.NewReader(string(bodyBytes))

	// Load the HTML document
	doc, err := goquery.NewDocumentFromReader(bodyReader)
	if err != nil {
		return analysis, fmt.Errorf("failed to parse HTML for %s: %w", targetURL, err)
	}

	htmlVersion := "Unknown"
	htmlString := string(bodyBytes) 
	if strings.Contains(htmlString, `<!DOCTYPE html>`) {
		htmlVersion = "HTML5"
	} else if strings.Contains(htmlString, `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"`) {
		htmlVersion = "HTML 4.01"
	} else if strings.Contains(htmlString, `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"`) {
		htmlVersion = "XHTML 1.0 Strict"
	}
	analysis.HTMLVersion = htmlVersion


	// 3. Extract Page Title
	analysis.PageTitle = doc.Find("title").Text()

	// 4. Count Heading Tags
	doc.Find("h1, h2, h3, h4, h5, h6").Each(func(i int, s *goquery.Selection) {
		switch goquery.NodeName(s) {
		case "h1":
			analysis.HeadingCounts.H1++
		case "h2":
			analysis.HeadingCounts.H2++
		case "h3":
			analysis.HeadingCounts.H3++
		case "h4":
			analysis.HeadingCounts.H4++
		case "h5":
			analysis.HeadingCounts.H5++
		case "h6":
			analysis.HeadingCounts.H6++
		}
	})

	// 5. Count Internal vs. External Links & Find Inaccessible Links
	baseURL, err := url.Parse(targetURL)
	if err != nil {
		log.Printf("Error parsing base URL %s: %v", targetURL, err)
		return analysis, fmt.Errorf("invalid base URL: %w", err)
	}

	var internalLinks int
	var externalLinks int
	var inaccessibleLinks []models.BrokenLink

	doc.Find("a[href]").Each(func(i int, s *goquery.Selection) {
		href, exists := s.Attr("href")
		if !exists || href == "" || href == "#" {
			return /
		}

		// Resolve relative URLs
		resolvedURL, err := baseURL.Parse(href)
		if err != nil {
			log.Printf("Error resolving link %s from %s: %v", href, targetURL, err)
			return // Skip malformed links
		}

		// Normalize URL (remove fragment, query for comparison)
		resolvedURL.Fragment = ""
		resolvedURL.RawQuery = ""

		linkStr := resolvedURL.String()

		// Determine if internal or external
		if resolvedURL.Hostname() == baseURL.Hostname() {
			internalLinks++
		} else {
			externalLinks++
		}

		// Check for inaccessible links (only for absolute http/https links)
		if strings.HasPrefix(linkStr, "http://") || strings.HasPrefix(linkStr, "https://") {
				go func(link models.BrokenLink, actualLink string) { 
				req, err := http.NewRequest(http.MethodHead, actualLink, nil)
				if err != nil {
					log.Printf("Error creating HEAD request for %s: %v", actualLink, err)
					return
				}
				
				req.Header.Set("User-Agent", "Sykell-Crawler/1.0")

				client := &http.Client{Timeout: 10 * time.Second} 
				linkResp, err := client.Do(req)
				if err != nil {
					log.Printf("Error checking link %s: %v", actualLink, err)
					inaccessibleLinks = append(inaccessibleLinks, models.BrokenLink{URL: actualLink, StatusCode: 0}) // 0 for network error
					return
				}
				defer linkResp.Body.Close()

				if linkResp.StatusCode >= 400 {
					inaccessibleLinks = append(inaccessibleLinks, models.BrokenLink{URL: actualLink, StatusCode: linkResp.StatusCode})
				}
			}(models.BrokenLink{URL: linkStr}, linkStr) 
		}
	})

	
	time.Sleep(2 * time.Second) 

	analysis.InternalLinks = internalLinks
	analysis.ExternalLinks = externalLinks
	analysis.InaccessibleLinks = inaccessibleLinks // This will contain results from goroutines

	// 6. Check for Presence of a Login Form
	hasLoginForm := false
	doc.Find("form").Each(func(i int, s *goquery.Selection) {
		// Look for common login form indicators
		if s.Find("input[type=password]").Length() > 0 ||
			s.Find("input[name*='user'], input[name*='email'], input[name*='login']").Length() > 0 ||
			s.Find("input[name*='pass']").Length() > 0 {
			hasLoginForm = true
			return 
		}
	})
	analysis.HasLoginForm = hasLoginForm

	analysis.Status = models.StatusDone
	return analysis, nil
}