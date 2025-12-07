# SkyBooker - Flight Booking Platform

A modern flight booking web application built with Vue.js and Node.js.

## Features

- Flight search with round trip and one-way options
- User authentication (register/login)
- Booking management
- Flight results filtering
- Responsive design inspired by Google Flights

## Tech Stack

**Frontend:** Vue.js 3, Vue Router, Vite  
**Backend:** Node.js, Express  
**Storage:** LocalStorage for demo purposes

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm

### Clone the Repository

```bash
git clone https://github.com/SilverBtc/AirlineBookingProject.git
cd AirlineBookingProject
```

## Running Locally

### 1. Start the Backend Server

Open a terminal and run:

```bash
cd backend
npm install
npm run dev
```

The backend server will start on `http://localhost:3000`

### 2. Start the Frontend Server

Open a **new terminal** and run:

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`

### 3. Access the Application

Open your browser and go to:
```
http://localhost:5173
```

## Project Structure

```
AirlineBookingProject/
├── frontend/           # Vue.js application
│   ├── src/
│   │   ├── components/ # Vue components
│   │   ├── router/     # Route configuration
│   │   ├── services/   # API services
│   │   └── assets/     # Styles
│   └── package.json
│
├── backend/            # Node.js API
│   ├── server.js
│   └── package.json
│
└── README.md
```

## Usage

1. Register a new account or login
2. Search for flights by entering origin, destination, and dates
3. Select a flight from the results
4. Complete the booking form
5. View your bookings in "My Bookings"

## Note

This is a demonstration project. No real flight bookings or payments are processed. All data is stored locally in your browser.

## Author

SilverBtc

## License

Open source - Educational purposes