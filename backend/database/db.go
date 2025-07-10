// backend/database/db.go
package database

import (
	"log"
	"os"
	"time"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"

	"sykell-url-crawler/backend/models" 
)

var DB *gorm.DB

func Connect() {
	dsn := os.Getenv("MYSQL_DSN")
	if dsn == "" {
		dsn = "root:ali123@tcp(127.0.0.1:3306)/sykell_crawler?charset=utf8mb4&parseTime=True&loc=Local"
	}

	var err error
	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{
	})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	sqlDB, err := DB.DB()
	if err != nil {
		log.Fatalf("Failed to get generic database object: %v", err)
	}

	// Set connection pool settings
	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Hour)

	log.Println("Database connection established.")

	// AutoMigrate will create/update tables based on the struct
	err = DB.AutoMigrate(&models.URLAnalysis{})
	if err != nil {
		log.Fatalf("Failed to auto migrate database schema: %v", err)
	}
	log.Println("Database migrations completed.")
}