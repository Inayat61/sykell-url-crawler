# Sykell URL Crawler

This project is a full-stack web application developed as a test task for the Sykell Full-Stack Developer position. It allows users to input a URL, crawl it, and display key information about the webpage.

## Technologies Used

* **Frontend:** React, TypeScript, Material-UI, **Recharts**
* **Backend:** Go (Golang), **Gin Web Framework**, MySQL

## Setup and Running

### Database (MySQL)

This project requires a MySQL 8.0 database. The easiest way to set this up for local development is using Docker:

1.  **Install Docker Desktop** (if you haven't already).
2.  **Run a MySQL container:**
    ```bash
    docker run --name sykell-mysql -e MYSQL_ROOT_PASSWORD=mysecretpassword -e MYSQL_DATABASE=sykell_crawler -p 3306:3306 -d mysql:8.0
    ```
    (Note: Replace `mysecretpassword` with your desired password. This password will also need to be configured in your backend's database connection string if you've changed it from the default.)
3.  Verify the container is running: `docker ps`

### Backend (Go)

1.  Navigate to the `backend` directory: `cd backend`
2.  Install dependencies: `go mod tidy`
3.  Run the server: `go run main.go`
    *The backend server will start on `http://localhost:8080`.*
    **(Optional) Build the executable (for deployment/testing):**
    ```bash
    go build -o sykell-api main.go
    ./sykell-api
    ```

### Frontend (React/TypeScript)

1.  Navigate to the `frontend` directory: `cd frontend`
2.  Install dependencies (including Material-UI and Recharts): `npm install`
3.  Run the development server: `npm start`
    *The frontend application will open in your browser on `http://localhost:3000`.*

## How to Use

1.  Ensure both the **MySQL Docker container** and the **Go Backend server** are running.
2.  Open your browser to `http://localhost:3000`.
3.  **Add a URL:**
    * In the "Website URL" input field, enter a full URL (e.g., `https://www.google.com`).
    * Click "Add URL".
    * You should see a success message or an error if the URL is invalid or already exists.
    * The newly added URL will appear in the "Analysis Results" table below with a "Queued" status.

4.  **Trigger a Crawl:**
    * In the "Analysis Results" table, find a URL with "Queued" status.
    * Click the "Crawl" button in the "Actions" column.
    * The button will change to "Running...", and the status chip will update optimistically.
    * After the backend completes the crawl (this runs asynchronously), the table data for that URL will update with extracted information (Title, HTML Version, Link counts, etc.) and the status will become "Done" or "Error".
    * You can click the "Refresh" button above the table at any time to manually fetch the latest data.

5.  **View Details:**
    * Click the "Details" button next to any URL in the "Analysis Results" table.
    * This will navigate you to a dedicated page showing comprehensive analysis results for that URL, including:
        * A donut chart visualizing the distribution of internal vs. external links.
        * A list of any inaccessible (broken) links found, along with their HTTP status codes.

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

* **URL Management**: Add new URLs for analysis.
* **Dashboard View**: See a list of all URLs with their current status and key analysis results.
* **Web Crawling**: The backend fetches the URL, parses its HTML, and extracts:
    * HTML version (e.g., HTML5)
    * Page title
    * Counts of all heading tags (H1, H2, H3, H4, H5, H6)
    * Number of internal and external links
    * A list of inaccessible (broken) links (HTTP status code >= 400 or network error)
    * Presence of a login form
* **Asynchronous Crawling**: Crawls run in the background, keeping the API responsive.
* **Status Tracking**: URLs have statuses (queued, running, done, error).
* **URL Details View**: A dedicated page to see comprehensive analysis results, including a donut chart for link distribution and a list of broken links.
* **Bulk Actions**: Trigger crawls for multiple selected URLs at once.

## Known Limitations / Future Improvements

Due to time constraints for this test task, the following features and enhancements from the original requirements or best practices were not fully implemented or could be improved:

* **Frontend Dashboard Enhancements**:
    * **Pagination, Sorting, Filtering, and Global Search** are not yet implemented in the "Analysis Results" table.
* **Real-Time Progress Updates**: The current status updates are optimistic (immediately after triggering a crawl) and require a manual refresh. True real-time updates (e.g., via WebSockets or polling for status changes from the backend) are not implemented.
* **Authorization Mechanism**: The backend API endpoints do not currently implement any authentication or authorization. All endpoints are publicly accessible.
* **Automated Frontend Tests**: While the project uses TypeScript and has a `test` script, comprehensive automated frontend tests covering happy-path scenarios have not been implemented.
* **Bulk Delete Action**: The ability to delete multiple selected URLs from the dashboard is not implemented.
* **HTML Version & Heading Count Accuracy**: For some complex websites, the HTML version might be reported as "N/A" or heading counts might be zero, indicating areas where the parsing logic in the backend crawler could be refined.
* **Full Dockerization**: While MySQL runs in Docker, the Go backend and React frontend are run directly from their respective development servers. Creating Dockerfiles for the backend API and frontend application would enable fully containerized, reproducible builds for deployment.