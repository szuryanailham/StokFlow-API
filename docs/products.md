# 📦 Product API Documentation

All endpoints require authentication via an access token in the `Authorization` header.

---

## 🔐 Common Header

```
Authorization: Bearer <your_token_here>
```

---

## 📘 GET All Products

### **Endpoint**

```http
GET /api/products?page=1&limit=10
```

### **Query Parameters**

| Name  | Type   | Description              |
| ----- | ------ | ------------------------ |
| page  | Number | (Optional) Default: `1`  |
| limit | Number | (Optional) Default: `10` |

### ✅ Response — 200 OK

```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": 14,
        "sku": "duplikatSKU",
        "productName": "Produk A",
        "description": null,
        "isActive": true,
        "purchasePrice": 10000,
        "sellingPrice": 12000,
        "currentStockQty": 20,
        "minStockThreshold": 5,
        "createdAt": "2025-08-13T16:51:04.404Z",
        "updatedAt": "2025-08-13T16:51:04.404Z"
      },
      {
        "id": 24,
        "sku": "test12346",
        "productName": "Test Product",
        "description": "This is a test product",
        "isActive": true,
        "purchasePrice": 10000,
        "sellingPrice": 12000,
        "currentStockQty": 20,
        "minStockThreshold": 5,
        "createdAt": "2025-08-25T05:48:17.716Z",
        "updatedAt": "2025-08-25T05:48:17.716Z"
      }
    ],
    "total": 2,
    "pagination": {
      "page": 1,
      "limit": 10
    }
  }
}
```

---

## 📘 GET Product by ID

### **Endpoint**

```http
GET /api/products/:id
```

### ✅ Response — 200 OK

```json
{
  "message": "Get product detail success",
  "data": {
    "product": {
      "id": 1,
      "sku": "SKU001",
      "productName": "Product A",
      ...
    }
  }
}
```

### ❌ 404 Not Found

```json
{
  "status": "error",
  "message": "Product with ID 999999 not found"
}
```

---

## 🆕 POST Create Product

### **Endpoint**

```http
POST /api/products
```

### **Request Body**

```json
{
  "sku": "test12345",
  "productName": "Test Product",
  "description": "This is a test product",
  "purchasePrice": 10000.0,
  "sellingPrice": 12000.0,
  "currentStockQty": 20,
  "minStockThreshold": 5
}
```

### ✅ Response — 201 Created

```json
{
  "data": {
    "product": {
      "id": 1,
      "sku": "test12345",
      "productName": "Test Product",
      ...
    }
  }
}
```

### ❌ 400 Bad Request

- Missing or empty required fields
- Invalid types
- Extra fields

```json
{
  "status": "error",
  "errors": "Validation error: sku is required"
}
```

### ❌ 409 Conflict

- Duplicate SKU

```json
{
  "status": "error",
  "errors": "SKU already exists"
}
```

---

## 📝 PUT Update Product

### **Endpoint**

```http
PUT /api/products/:id
```

### **Request Body**

```json
{
  "sku": "updatedSKU",
  "productName": "Updated Product",
  "description": "Updated product description",
  "purchasePrice": 11000.0,
  "sellingPrice": 13000.0,
  "currentStockQty": 30,
  "minStockThreshold": 10
}
```

### ✅ Response — 200 OK

```json
{
  "message": "Product updated successfully",
  "data": {
    "product": {
      "id": 1,
      "sku": "updatedSKU",
      ...
    }
  }
}
```

### ❌ 404 Not Found

```json
{
  "status": "error",
  "message": "Product with ID 999999 not found"
}
```

---

## 🗑️ DELETE Product by ID

### **Endpoint**

```http
DELETE /api/products/:id
```

### ✅ Response — 200 OK

```json
{
  "message": "Product deleted successfully",
  "data": {
    "product": {
      "id": 1,
      "sku": "test12345",
      ...
    }
  }
}
```

### ❌ 404 Not Found

```json
{
  "status": "error",
  "message": "Product with ID 999999 not found"
}
```

---

## 🔐 401 Unauthorized

For any request without valid token:

```json
{
  "status": "error",
  "errors": "Unauthorized"
}
```
