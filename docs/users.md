# User API Specification

## Login User API

Endpoint : POST api/auth/login

Description :
This endpoint is used for the login process to validate users who want to access the application. The user sends a request containing their credentials to proceed

### Request Login API

```json
{
  "email": "admin@stokflow.com",
  "password": "testpassword123"
}
```

### Response Login Sucess API

✅ 200 OK (Berhasil Login)

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "name": "Admin StokFlow",
    "email": "admin@stokflow.com"
    "role": "admin"
  }
}
```

### Response 401 Unauthorized (Login gagal)

❌ 401 Unauthorized (Login gagal)

```json
{
  "message": "Invalid email or password"
}
```

### 500 Internal Server Error

❌ 500 Internal Server Error

```json
{
  "message": "Terjadi kesalahan server"
}
```

### 🏷️ Tags: [Auth], [Login]

## Logout User API

Endpoint : POST api/auth/logout

Description :
This endpoint is used to log user out from system in application , it validated the current session or token valudation

### Headers

```json
Authorization: Bearer <your_token_here>
```

### Request Body

No request body is required.

### Response Logout Success API

✅ 200 OK (Berhasil Login)

```json
{
  "message": "Logout successful"
}

### Response Logout Success API

```

### Response Logout Failed API

❌ 401 Unauthorized

```json
{
  "message": "Invalid or missing token"
}
```

### Response Logout Failed API

❌ 500 Internal Server Error

```json
{
  "message": "Invalid or missing token"
}
```

### Example with curl

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

```

### 🏷️ Tags: [Auth], [Logout]
