# HipHop Foundation API Testing

## Base URL

http://localhost:5000

## Authentication

Bearer Token via Authorization header

Authorization: Bearer {{auth_token}}

## Endpoints

### Product

GET /api/product  
POST /api/product  
PUT /api/product/:id  
DELETE /api/product/:id

### Post

GET /api/post  
POST /api/post  
PUT /api/post/:id  
DELETE /api/post/:id

### Message

POST /api/message  
GET /api/message

### Admin

POST /api/admin/register  
POST /api/admin/login  
GET /api/admin/stats
