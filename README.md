# Flight Ticket Management API

A Spring Boot REST API for managing flight ticket reservations, using PostgreSQL for production and H2 for testing. Supports searching tickets by name, booking date, destination, kickoff, and pickup address.

---

## Features

- Create, read, delete flight tickets
- Search tickets by name, booking date, destination, kickoff, and pickup address
- Data stored in PostgreSQL (production) or H2 (tests)

---

## Setup

### 1. Clone the repository

```sh
git clone <your-repo-url>
cd <your-repo-directory>
```

### 2. Configure the Database

Edit `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://<your-db-ip>:5432/flightdb
spring.datasource.username=postgres
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
```

For tests, H2 is used automatically (see `src/test/resources/application.properties`).

### 3. Build and Run

```sh
./gradlew build
./gradlew bootRun
```

---

## API Usage

### Create a Flight Ticket

**POST** `/api/tickets`

**Request Body Example:**

```json
{
  "bookingDate": "2024-07-09T10:00:00",
  "destination": "Paris",
  "kickoff": "2024-07-15T10:00:00",
  "name": "John Doe",
  "phoneNumber": "1234567890",
  "email": "john.doe@example.com",
  "pickupAddress": "123 Main St, City"
}
```

**Curl Example:**

```sh
curl -X POST http://localhost:8080/api/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "bookingDate": "2024-07-09T10:00:00",
    "destination": "Paris",
    "kickoff": "2024-07-15T10:00:00",
    "name": "John Doe",
    "phoneNumber": "1234567890",
    "email": "john.doe@example.com",
    "pickupAddress": "123 Main St, City"
  }'
```

---

### Get All Tickets

**GET** `/api/tickets`

**Curl Example:**

```sh
curl http://localhost:8080/api/tickets
```

---

### Search Tickets

**GET** `/api/tickets/search`

**Query Parameters:**

- `name` (string)
- `bookingDate` (string, format: `YYYY-MM-DDTHH:MM:SS`)
- `destination` (string)
- `kickoff` (string, format: `YYYY-MM-DDTHH:MM:SS`)
- `pickupAddress` (string)

**Examples:**

Find by name:

```sh
curl 'http://localhost:8080/api/tickets/search?name=John%20Doe'
```

Find by destination:

```sh
curl 'http://localhost:8080/api/tickets/search?destination=Paris'
```

Find by booking date:

```sh
curl 'http://localhost:8080/api/tickets/search?bookingDate=2024-07-09T10:00:00'
```

Find by pickup address:

```sh
curl 'http://localhost:8080/api/tickets/search?pickupAddress=123%20Main%20St,%20City'
```

---

### Get Ticket by ID

**GET** `/api/tickets/{id}`

**Curl Example:**

```sh
curl http://localhost:8080/api/tickets/1
```

---

### Delete Ticket by ID

**DELETE** `/api/tickets/{id}`

**Curl Example:**

```sh
curl -X DELETE http://localhost:8080/api/tickets/1
```

---

## Database Table

The main table is `flight_ticket` with columns:

- id
- booking_date (timestamp)
- destination (string)
- kickoff (timestamp)
- name (string)
- phone_number (string)
- email (string)
- pickup_address (string)

---

## Testing

Run tests with:

```sh
./gradlew test
```

---

## Notes

- Make sure PostgreSQL is running and accessible from your app host.
- For remote DB, ensure `listen_addresses = '*'` and correct `pg_hba.conf` settings.
- For any issues, check the logs or contact the maintainer.
