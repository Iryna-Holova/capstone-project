# Capstone Project: Real Estate Website

A modern Single Page Application (SPA) for browsing and managing real estate listings, featuring dynamic filtering, sorting, and multi-currency support.

## 🏠 Overview

This project provides a seamless user experience for exploring real estate properties available for rent or purchase. Users can filter listings by property type, price, and area, sort results based on various criteria, and view prices in their preferred currency.

## 🔧 Technologies

- **Frontend**: TypeScript, HTML, CSS
- **Bundler**: Parcel
- **Backend**: JSON Server (for mock API)
- **Containerization**: Docker, Docker Compose

---

## 🚀 Getting Started

### 📌 Prerequisites

- [Node.js](https://nodejs.org/) (recommended v20+)
- (optional) [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)

### 🔧 Installation

1. **Clone the repository**:

```sh
git clone https://github.com/Iryna-Holova/capstone-project.git
cd capstone-project
```

2. **Install dependencies**:

```sh
npm install
```

### 🏃 Running Locally

```sh
npm run build
npm start
```

This will build and run both:

- **Frontend**: Available at `http://localhost:1234`
- **Backend (json-server)**: API available at `http://localhost:3001`

### 🐳 Running with Docker

To run the application using Docker:

1. **Build and start containers**:

```sh
docker-compose up --build
```

This will:

- Build and start the frontend container
- Start the backend (`json-server`) container
- The `db.json` file is mounted as a volume to persist data between container restarts.

2. **Access the application**:

   - Frontend: `http://localhost:1234`
   - Backend API: `http://localhost:3001`

3. **Stop the Containers**:

```sh
docker-compose down
```

Any changes made to `db.json` will be retained across restarts.

---

## 🧰 Features

- **Home Page**: Introduction and navigation to other sections. Includes image slider.
- **Gallery Page** with separate **Rent** and **Buy** sections includes:
  - **Filters**:
    - Property Type
    - Price Range
    - Area Range
  - **Sorting Options**:
    - Date Added
    - Price
    - Area
    - Popularity
  - **Pagination**
- **Details Page**: Comprehensive information about selected property. Location is shown on Google Maps.
- **Currency Support**:
  - Properties store prices in various currencies.
  - Users can select their preferred currency for price display.

---

## 📂 Project Structure

```
 capstone-project/
 ├── src/                # Source code (HTML, CSS, TS)
 ├── static/             # Static files
 ├── db.json             # Mock database (persistent)
 ├── Dockerfile          # Docker configuration
 ├── docker-compose.yml  # Docker Compose config
 ├── package.json        # Project dependencies & scripts
 ├── server.js           # Frontend start point
 ├── README.md           # Project documentation
 └── ...                 # Other config files
```

---

## 🛠️ Available Scripts

- `npm run lint`: Runs ESLint and Stylelint for code quality checks.
- `npm run build`: Builds the application for production.
- `npm run start`: Builds and starts the application.
- `npm run dev`: Starts the development server with hot reloading.

---

## 📡 API Endpoints

- `GET /listings` - Fetch all listings
- `GET /listings/:id` - Fetch a single listing
- `PATCH /listings/:id` - Update listing data
- `GET /meta` - Fetch metadata (last update time)
- `PATCH /meta` - Update metadata

---

## 🎯 Notes

- To access the backend from a mobile device on the same network, use:
  ```js
  const API_BASE =
    process.env.API_URL || `http://${window.location.hostname}:3001`;
  ```
- The backend runs on `0.0.0.0` to allow external connections.

---

## 🌍 Deployment

- The project can be deployed on any Docker-compatible hosting provider.
- Ensure the `db.json` volume is mounted for persistent storage.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙌 Acknowledgements

Inspired by modern real estate platforms and built with a focus on user experience and performance. All data is fake, images are AI-generated
