# HipHop Foundation API Documentation

This document outlines the available API endpoints for the HipHop Foundation Platform.

**Base URL:** `http://localhost:5000`  
**Format:** `JSON`

## General

### Health Check

`GET /`
Check if the server is running.

- **Response:** `200 OK`

## Products

### Get All Products

`GET /api/products`
Retrieves a list of all merchandise.

- **Auth required:** No
- **Response:** `200 OK` (Array of Product objects)

### Create Product

`POST /api/products`
Adds a new product to the catalog.

- **Auth required:** Yes (Admin Only)
- **Headers:** `Content-Type: application/json`
- **Body:**

```json
{
  "name": "string",
  "description": "string",
  "price": "number",
  "category": "string",
  "countInStock": "number"
}
```

### 3. Authentication & Admin

```markdown
## Authentication

### Admin Register

`POST /api/admin/register`
Create a new admin account.

- **Body:** `{ "name": "...", "email": "...", "password": "..." }`

### Admin Login

`POST /api/admin/login`
Authenticate an admin and receive a token.

- **Body:** `{ "email": "...", "password": "..." }`
- **Response:** `200 OK`
- **Returns:** `{ "token": "JWT_STRING_HERE" }`
```

---

## Usage Notes

### Authentication

Most POST, PUT, and DELETE routes require a **Bearer Token**.

1. Login via `/api/admin/login` to get a token.
2. Include the token in the request header:
   `Authorization: Bearer <your_token>`

### Error Handling

The API uses standard HTTP status codes:

- `200/201`: Success
- `400`: Bad Request (Validation Error)
- `401`: Unauthorized (Missing/Invalid Token)
- `500`: Server Error
