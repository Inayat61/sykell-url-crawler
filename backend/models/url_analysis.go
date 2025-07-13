package models

import (
	"database/sql/driver"
	"encoding/json"       
	"errors"             
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

// Value implements the driver.Valuer interface for HeadingCounts.
func (hc HeadingCounts) Value() (driver.Value, error) {
	return json.Marshal(hc)
}

// Scan implements the sql.Scanner interface for HeadingCounts.
func (hc *HeadingCounts) Scan(value interface{}) error {
	b, ok := value.([]byte)
	if !ok {
		return errors.New("type assertion to []byte failed for HeadingCounts")
	}
	return json.Unmarshal(b, &hc)
}


// BrokenLink represents an inaccessible link with its status code.
type BrokenLink struct {
	URL        string `json:"url"`
	StatusCode int    `json:"status_code"`
}

// Define a new type for the slice of BrokenLink to attach methods to it
type BrokenLinks []BrokenLink

// Value implements the driver.Valuer interface for BrokenLinks.
func (bl BrokenLinks) Value() (driver.Value, error) {
	if bl == nil {
		return "[]", nil
	}
	return json.Marshal(bl)
}

// Scan implements the sql.Scanner interface for BrokenLinks.
func (bl *BrokenLinks) Scan(value interface{}) error {
	b, ok := value.([]byte)
	if !ok {
		return errors.New("type assertion to []byte failed for BrokenLinks")
	}
	if len(b) == 0 || string(b) == "null" {
		*bl = []BrokenLink{}
		return nil
	}
	return json.Unmarshal(b, &bl)
}


// URLAnalysis represents the data collected for a single URL.
type URLAnalysis struct {
	ID              int             `json:"id" gorm:"primaryKey"`
	URL             string          `json:"url" gorm:"unique;not null"`
	Status          AnalysisStatus  `json:"status"`
	HTMLVersion     string          `json:"html_version"`
	PageTitle       string          `json:"page_title"`
	HeadingCounts   HeadingCounts   `json:"heading_counts" gorm:"type:json"`
	InternalLinks   int             `json:"internal_links"`
	ExternalLinks   int             `json:"external_links"`
	InaccessibleLinks BrokenLinks     `json:"inaccessible_links" gorm:"type:json"`
	HasLoginForm    bool            `json:"has_login_form"`
	CreatedAt       time.Time       `json:"created_at"`
	UpdatedAt       time.Time       `json:"updated_at"`
}