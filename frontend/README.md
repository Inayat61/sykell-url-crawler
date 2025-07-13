# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

---

## Project Overview

This is the React TypeScript frontend application for the Sykell URL Crawler project. It provides a user interface to interact with the Go backend API, allowing users to submit URLs for analysis, view crawl results, and inspect detailed page information.

### Technologies Used

* **React:** For building the user interface.
* **TypeScript:** For type safety and better code maintainability.
* **Material-UI (MUI):** A comprehensive React UI library for beautiful and consistent components.
* **Recharts:** A charting library used to visualize link distribution on the URL details page.
* **React Router DOM:** For client-side routing within the application.

### Important Dependencies

This frontend application relies heavily on the **Go Backend API** being up and running. Ensure you have started the backend server (typically on `http://localhost:8080`) before running this frontend.

### Frontend Usage

1.  **Ensure Backend is Running:** The backend Go API needs to be accessible at `http://localhost:8080`.
2.  **Install Dependencies:** Navigate to this `frontend` directory in your terminal and run `npm install`.
3.  **Start the Development Server:** Use `npm start` (as described below).
4.  **Interact with the UI:**
    * Enter a URL in the input field on the dashboard.
    * Click "Add URL".
    * Select a URL from the table and click "Crawl" to initiate the analysis.
    * Click "Details" to view comprehensive information, including heading counts, link distribution charts, and inaccessible links.

---

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.com/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://react.dev/).