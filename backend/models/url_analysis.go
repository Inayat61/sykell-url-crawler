// backend/models/url_analysis.go
package models

import (
	"time"
)

// AnalysisStatus defines the possible states of a URL analysis.
type AnalysisStatus string

const (
	StatusQueued  AnalysisStatus = "queued"
	StatusRunning AnalysisStatus = "running"
	StatusDone    AnalysisStatus = "done"
	StatusError   AnalysisStatus = "error"
)

// HeadingCounts stores the count of each heading level.
type HeadingCounts struct {
	H1 int `json:"h1"`
	H2 int `json:"h2"`
	H3 int `json:"h3"`
	H4 int `json:"h4"`
	H5 int `json:"h5"`
	H6 int `json:"h6"`
}

// BrokenLink represents an inaccessible link with its status code.
type BrokenLink struct {
	URL        string `json:"url"`
	StatusCode int    `json:"status_code"`
}

// URLAnalysis represents the data collected for a single URL.
type URLAnalysis struct {
	ID              int             `json:"id"`
	URL             string          `json:"url"`
	Status          AnalysisStatus  `json:"status"`
	HTMLVersion     string          `json:"html_version"`
	PageTitle       string          `json:"page_title"`
	HeadingCounts   HeadingCounts   `json:"heading_counts" gorm:"type:json"` // Store as JSON in DB
	InternalLinks   int             `json:"internal_links"`
	ExternalLinks   int             `json:"external_links"`
	InaccessibleLinks []BrokenLink    `json:"inaccessible_links" gorm:"type:json"` // Store as JSON in DB
	HasLoginForm    bool            `json:"has_login_form"`
	CreatedAt       time.Time       `json:"created_at"`
	UpdatedAt       time.Time       `json:"updated_at"`
}