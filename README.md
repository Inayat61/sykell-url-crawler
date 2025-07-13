# Sykell URL Crawler

This project is a full-stack web application developed as a test task for the Sykell Full-Stack Developer position. It allows users to input a URL, crawl it, and display key information about the webpage.

## Technologies Used

* **Frontend:** React, TypeScript
* **Backend:** Go (Golang), chosen framework (e.g., Gin), MySQL


## Setup and Running 

### Database (MySQL)

This project requires a MySQL 8.0 database. The easiest way to set this up for local development is using Docker:

1.  **Install Docker Desktop** (if you haven't already).
2.  **Run a MySQL container:**
    ```bash
    docker run --name sykell-mysql -e MYSQL_ROOT_PASSWORD=mysecretpassword -e MYSQL_DATABASE=sykell_crawler -p 3306:3306 -d mysql:8.0
    ```
    (Note: Replace `mysecretpassword` with your desired password. This password will also need to be configured in the backend's DSN if you don't use the default.)
3.  Verify the container is running: `docker ps`


### Backend (Go)

1.  Navigate to the `backend` directory: `cd backend`
2.  Initialize Go modules (if not already done): `go mod init sykell-url-crawler/backend`
3.  Install dependencies: `go mod tidy`
4.  Run the server: `go run main.go`
    *The backend server will start on `http://localhost:8080`.*


### Frontend (React/TypeScript)

1.  Navigate to the `frontend` directory: `cd frontend`
2.  Install dependencies: `npm install`
3.  Run the development server: `npm start`
    *The frontend application will open in your browser on `http://localhost:3000`.*



## API Endpoints

Once the backend server is running (`go run main.go` in the `backend` directory), you can interact with the API:

* **`GET /api/ping`**: Basic health check.
    * `curl http://localhost:8080/api/ping`
* **`POST /api/urls`**: Add a new URL for analysis.
    * **Request Body (JSON):** `{"url": "https://example.com"}`
    * **Example:** `curl -X POST -H "Content-Type: application/json" -d '{"url": "https://example.com"}' http://localhost:8080/api/urls`
* **`GET /api/urls`**: Get a list of all analyzed URLs.
    * `curl http://localhost:8080/api/urls`
* **`GET /api/urls/:id`**: Get details for a specific URL by its ID.
    * **Example:** `curl http://localhost:8080/api/urls/1` (replace `1` with an actual ID)
* **`POST /api/urls/:id/crawl`**: Trigger the web crawling process for a specific URL.
    * **Example:** `curl -X POST http://localhost:8080/api/urls/1/crawl` (replace `1` with an actual URL ID)
    * This API call returns immediately. The crawl itself runs in the background. You can use `GET /api/urls/:id` or `GET /api/urls` to check the `status` of the crawl.


## Features

* URL management (Add, Start/Stop processing)
* Results Dashboard (Paginated, sortable table with filters)
* Details View for individual URLs
* Bulk actions
* Real-time crawl progress updates

---

_Further instructions for building and running the application will be added here as development progresses._