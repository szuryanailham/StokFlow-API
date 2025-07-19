Here's the **corrected and neatly formatted** version of your **User API Specification**:

---

# **User API Specification**

---

## 🔐 Login User API

- **Endpoint**: `POST /api/auth/login`
- **Description**:
  This endpoint is used for the login process to validate users who want to access the application. The user sends a request containing their credentials.

---

### ✅ Request Body

```json
{
  "email": "admin@stokflow.com",
  "password": "testpassword123"
}
```

---

### ✅ Response 200 - Login Successful

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "name": "Admin StokFlow",
    "email": "admin@stokflow.com",
    "role": "admin"
  }
}
```

---

### ❌ Response 401 - Unauthorized (Invalid credentials)

```json
{
  "message": "Invalid email or password"
}
```

---

### ❌ Response 500 - Internal Server Error

```json
{
  "message": "Terjadi kesalahan server"
}
```

---

### 🏷️ Tags: `Auth`, `Login`

---

## 🔓 Logout User API

- **Endpoint**: `POST /api/auth/logout`
- **Description**:
  This endpoint is used to log the user out from the application by invalidating their current session or token.

---

### 🧾 Headers

```
Authorization: Bearer <your_token_here>
```

---

### ✅ Request Body

_No request body required._

---

### ✅ Response 200 - Logout Successful

```json
{
  "message": "Logout successful"
}
```

---

### ❌ Response 401 - Unauthorized

```json
{
  "message": "Invalid or missing token"
}
```

---

### ❌ Response 500 - Internal Server Error

```json
{
  "message": "Terjadi kesalahan server"
}
```

---

### 🧪 Example (cURL)

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 🏷️ Tags: `Auth`, `Logout`

---

## 🗑️ Delete Product By ID

**Endpoint**: `DELETE /api/products/:id`

**Description**:
Delete a product from the database based on the provided product ID.

---

### 🔐 Authorization

**Header Required**:

```http
Authorization: Bearer <your_token_here>
```

---

### ✅ Success Response

**200 OK**

```json
{
  "message": "Product deleted successfully",
  "data": {
    "id": 12,
    "sku": "SKU-2025-012",
    "product_name": "Gaming Keyboard Mechanical RGB"
  }
}
```

---

### ❌ Error Responses

**400 Bad Request**

```json
{
  "message": "Invalid product ID format"
}
```

**401 Unauthorized**

```json
{
  "message": "Unauthorized"
}
```

**403 Forbidden**

```json
{
  "message": "You do not have permission to delete this product"
}
```

**404 Not Found**

```json
{
  "message": "Product with ID 12 not found"
}
```

**500 Internal Server Error**

```json
{
  "message": "An unexpected error occurred while deleting the product"
}
```

---

### 🏷️ Tags: \[Products], \[Delete], \[Admin]
