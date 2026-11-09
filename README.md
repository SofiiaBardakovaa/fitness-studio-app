# Fitness Studio

## Project Overview

**Fitness Studio** is a web application designed to automate the operations of a fitness studio. It provides functionality for managing clients, trainers, training sessions, schedules, and bookings.

The project was developed as part of a laboratory assignment on document-oriented databases and demonstrates the use of MongoDB for storing, retrieving, updating, and processing data.

## Technologies Used

- **MongoDB** – NoSQL database management system.
- **Next.js 16** – React framework for web application development.
- **React** – Library for building user interfaces.
- **TypeScript** – Programming language.
- **MongoDB Node.js Driver** – Used to connect the application to MongoDB.

## Database Structure

Database name: `fitness_studio_db`

The database contains five collections:

| Collection | Description |
|---|---|
| `clients` | Stores client information. |
| `trainers` | Stores trainer information. |
| `trainings` | Stores information about training sessions. |
| `schedules` | Stores training schedules, including dates and times. |
| `bookings` | Stores client bookings for training sessions. |

The collections use MongoDB `ObjectId` values to reference related documents. JSON Schema validators are used to validate document structures.

## Main Features

- Create, view, update, and delete client records.
- View training sessions and trainer information.
- Search for clients by name, email, or phone number.
- Filter training sessions by name, trainer, date, and maximum price.
- Retrieve related information from multiple collections using the `$lookup` aggregation stage.
- Increase the prices of all training sessions using `updateMany()`.
- Sort and aggregate database records.

## Prerequisites

Make sure the following software is installed:

- [Node.js](https://nodejs.org/)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community)
- [MongoDB Shell (mongosh)](https://www.mongodb.com/try/download/shell)
- npm (included with Node.js)

## Installation and Setup

### 1. Clone or download the project

Open a terminal in the project directory.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the database connection

Create a `.env.local` file in the project root directory and configure the MongoDB connection string.

Use the environment variable name expected by the application.

Example:

```env
MONGODB_URI=mongodb://localhost:27017
```

### 4. Start MongoDB

Make sure the MongoDB server is running.

### 5. Create the database and collections

Execute the database creation script:

```bash
mongosh --file create_db.js
```

### 6. Insert test data

Execute the test data script:

```bash
mongosh --file add_test_data.js
```

### 7. Start the application

Run the development server:

```bash
npm run dev
```

### 8. Open the application

Open the following address in your browser:

```text
http://localhost:3000
```

## Project Purpose

The project demonstrates the practical application of MongoDB, including database and collection creation, document validation, CRUD operations, conditional queries, data filtering, updates, and aggregation across multiple collections.