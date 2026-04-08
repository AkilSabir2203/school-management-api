# School Management API

Node.js, Express, and Sequelize API for managing schools in MySQL.

The application supports:

- Automatic MySQL database creation on startup
- Automatic table creation with Sequelize sync
- Seed data insertion with Sequelize CLI
- School creation and listing APIs
- Distance-based sorting using the Haversine formula
- Request validation with express-validator

## Tech Stack

- Node.js
- Express
- Sequelize
- MySQL
- express-validator
- dotenv

## Project Structure

The main application code lives inside src:

- src/config - environment and database setup
- src/controllers - request handlers
- src/middlewares - validation and error handlers
- src/models - Sequelize model definitions
- src/routes - versioned route files
- src/services - business logic and database access
- src/migrations - Sequelize migration files
- src/seeders - Sequelize seed files

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a .env file in the project root with the following values:

```env
MYSQL_USER="root"
MYSQL_PASSWORD="your_mysql_password"
MYSQL_DATABASE="school_management"
MYSQL_HOST="127.0.0.1"
MYSQL_PORT="3306"
PORT=3000
```

Notes:

- MYSQL_DATABASE is the database that the app will create if it does not already exist.
- The app currently creates the database automatically at startup.
- The school table is created automatically through Sequelize sync.

### 3. Run the app

```bash
npm run dev
```

The server starts on the port defined in PORT.

### 4. Seed the database

```bash
npm run seed
```

This inserts the initial school rows into the schools table.

## Database Behavior

On startup the app does the following:

1. Connects to MySQL using the values from .env
2. Creates the database if it does not exist
3. Authenticates the Sequelize connection
4. Syncs the Sequelize models to create the schools table

## Sequelize Model

The School model includes:

- id - auto increment primary key
- name - required string
- address - required string
- latitude - required float
- longitude - required float

## API Endpoints

### 1. GET /api/v1/info

Returns a basic API health response.

Example response:

```json
{
  "success": true,
  "message": "API is Live",
  "error": {},
  "data": {}
}
```

### 2. POST /api/v1/addSchool

Creates a new school record.

Request body:

```json
{
  "name": "Green Valley School",
  "address": "123 Main Street",
  "latitude": 12.9716,
  "longitude": 77.5946
}
```

Validation rules:

- name is required
- address is required
- latitude is required and must be a valid number between -90 and 90
- longitude is required and must be a valid number between -180 and 180

Success response:

```json
{
  "success": true,
  "message": "School created successfully",
  "data": {
    "id": 1,
    "name": "Green Valley School",
    "address": "123 Main Street",
    "latitude": 12.9716,
    "longitude": 77.5946
  }
}
```

Status code:

- 201 Created

### 3. GET /api/v1/listSchools

Returns all schools sorted by proximity from the supplied coordinates.

Query parameters:

- latitude - required
- longitude - required

Example URL:

```text
http://localhost:3000/api/v1/listSchools?latitude=20&longitude=80
```

Validation rules:

- latitude is required and must be a valid number between -90 and 90
- longitude is required and must be a valid number between -180 and 180

Success response:

```json
{
  "success": true,
  "message": "Schools fetched successfully",
  "data": [
    {
      "id": 1,
      "name": "Rajkumar College (RKC)",
      "address": "G.E. Road, Mukut Nagar, Raipur, Chhattisgarh 492001",
      "latitude": 21.2392,
      "longitude": 81.6166,
      "distance": 0
    },
    {
      "id": 2,
      "name": "St. Xavier's High School",
      "address": "Avanti Vihar, Ravigram, Raipur, Chhattisgarh 492006",
      "latitude": 21.2471,
      "longitude": 81.6667,
      "distance": 5.12
    }
  ]
}
```

Status code:

- 200 OK

### Validation Error Response

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "latitude",
      "message": "Latitude query parameter is required"
    }
  ]
}
```

## Example Requests

### cURL - Add School

```bash
curl -X POST http://localhost:3000/api/v1/addSchool \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Green Valley School",
    "address": "123 Main Street",
    "latitude": 12.9716,
    "longitude": 77.5946
  }'
```

### cURL - List Schools

```bash
curl "http://localhost:3000/api/v1/listSchools?latitude=20&longitude=80"
```

## Seed Data

The current seeder inserts sample schools into the schools table:

- Rajkumar College (RKC)
- St. Xavier's High School

Run the seeder after the app has created the database and table:

```bash
npm run seed
```

## Notes

- The app uses a global error handler for unhandled route and server errors.
- listSchools uses the Haversine formula to calculate distance in kilometers.
- The current route structure exposes school endpoints under /api/v1/addSchool and /api/v1/listSchools.
- If you change the port in .env, update the endpoint URLs accordingly.

## Troubleshooting

### Route not found

Make sure you are calling the current versioned URLs:

- /api/v1/addSchool
- /api/v1/listSchools

### Validation failed for listSchools

Pass both latitude and longitude as query parameters in the URL.

### Database not created

Check that MYSQL_USER, MYSQL_PASSWORD, MYSQL_HOST, and MYSQL_PORT are valid and that the MySQL server is running.