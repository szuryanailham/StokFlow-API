---

# 📦 Products API Specification

## 🔹 Get All Products

### Endpoint

```http
GET /api/products
```

### Description

**Get all products** endpoint is used to retrieve and display all products stored in the database server.

### Headers

```http
Authorization: Bearer <your_token_here>
```

### Query Parameters

| Name      | Type   | Required | Description                               |
| --------- | ------ | -------- | ----------------------------------------- |
| page      | number | No       | Page number for pagination (default: 1)   |
| per\_page | number | No       | Number of products per page (default: 10) |

### Request Body

*No request body is required.*

### ✅ Success Response — 200 OK

```json
{
  "status": "success",
  "message": "All products retrieved successfully",
  "data": {
    "products": [
      {
        "id": 1,
        "sku": "PROD-001",
        "product_name": "Wireless Mouse",
        "description": "High-precision wireless mouse with ergonomic design",
        "purchase_price": 75000,
        "selling_price": 120000,
        "current_stock_qty": 45,
        "min_stock_threshold": 10,
        "created_at": "2025-07-10T09:15:00Z",
        "updated_at": "2025-07-17T14:22:00Z"
      },
      {
        "id": 2,
        "sku": "PROD-002",
        "product_name": "Mechanical Keyboard",
        "description": "RGB backlit mechanical keyboard with blue switches",
        "purchase_price": 200000,
        "selling_price": 350000,
        "current_stock_qty": 20,
        "min_stock_threshold": 5,
        "created_at": "2025-07-11T11:00:00Z",
        "updated_at": "2025-07-17T14:22:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 10,
      "total": 100,
      "total_pages": 10
    }
  }
}
```

---

## 🔹 Get Product By ID (with StockMovements)

### Endpoint

```http
GET /api/products/detail/:id?page=1&per_page=10
```

### Description

**Get product by ID** endpoint is used to display a product in detail **along with all associated stock movement records** from the `StockMovements` table.

### Headers

```http
Authorization: Bearer <your_token_here>
```

### Query Parameters (for pagination on StockMovements)

Berikut adalah spesifikasi lengkap API **Get Product by ID** termasuk pagination dan response untuk kasus error seperti unauthorized, not found, dan internal server error:

---

## 🔍 Get Product By ID (With Stock Movement History & Pagination)

### **Endpoint**

```http
GET /api/products/detail/:id?page=1&per_page=10
```

### **Description**

**Get product by ID** endpoint is used to display detailed product information along with paginated stock movement records associated with it.

---

### **Headers**

```http
Authorization: Bearer <your_token_here>
Content-Type: application/json
```

---

### **Query Parameters**

| Parameter  | Type | Description                                             |
| ---------- | ---- | ------------------------------------------------------- |
| `page`     | int  | Current page number (default: 1)                        |
| `per_page` | int  | Number of stock movement entries per page (default: 10) |

---

### **Success Response** ✅ `200 OK`

```json
{
  "status": "success",
  "message": "Product detail retrieved successfully",
  "data": {
    "id": 1,
    "sku": "PROD-001",
    "product_name": "Wireless Mouse",
    "description": "High-precision wireless mouse with ergonomic design",
    "purchase_price": 75000,
    "selling_price": 120000,
    "current_stock_qty": 45,
    "min_stock_threshold": 10,
    "created_at": "2025-07-10T09:15:00Z",
    "updated_at": "2025-07-17T14:22:00Z",
    "stock_movements": {
      "current_page": 1,
      "per_page": 10,
      "total_data": 25,
      "last_page": 3,
      "data": [
        {
          "id": 101,
          "movement_type": "IN",
          "quantity_changed": 10,
          "stock_after_movement": 45,
          "reason": "Purchase",
          "movement_date": "2025-07-16T10:30:00Z",
          "user_id": 2
        },
        {
          "id": 102,
          "movement_type": "OUT",
          "quantity_changed": 5,
          "stock_after_movement": 35,
          "reason": "Sale",
          "movement_date": "2025-07-14T08:45:00Z",
          "user_id": 1
        }
      ]
    }
  }
}
```

---

### **Error Responses**

#### ❌ `401 Unauthorized`

When the request does not include a valid authentication token.

```json
{
  "status": "error",
  "message": "Unauthorized. Please login first"
}
```

#### ❌ `404 Not Found`

When the product ID provided does not exist in the database.

```json
{
  "status": "error",
  "message": "Product not found"
}
```

#### ❌ `400 Bad Request`

When the request parameters (e.g., invalid `id` format or pagination values) are incorrect.

```json
{
  "status": "error",
  "message": "Invalid request parameters"
}
```

#### ❌ `500 Internal Server Error`

If there’s a problem on the server side while fetching the data.

```json
{
  "status": "error",
  "message": "Something went wrong. Please try again later"
}
```

---

Here is the **API Specification** for the `Update Product By ID` endpoint, structured clearly with success and error responses:

---

## 🔄 Update Product By ID

**Endpoint**: `PUT /api/products/:id`
**Description**:
This endpoint is used to update an existing product’s data in the database based on the provided product ID.

---

### 🔐 Authorization

**Header Required**:

```http
Authorization: Bearer <your_token_here>
```

---

### 📥 Request Body

```json
{
  "sku": "SKU-2025-001",
  "product_name": "Mouse Wireless Logitech",
  "description": "High-precision wireless mouse with USB receiver",
  "purchase_price": 110000,
  "selling_price": 160000,
  "current_stock_qty": 30,
  "min_stock_threshold": 5
}
```

---

### ✅ Success Response

**200 OK**

```json
{
  "message": "Product updated successfully",
  "data": {
    "id": 1,
    "sku": "SKU-2025-001",
    "product_name": "Mouse Wireless Logitech",
    "description": "High-precision wireless mouse with USB receiver",
    "purchase_price": 110000,
    "selling_price": 160000,
    "current_stock_qty": 30,
    "min_stock_threshold": 5,
    "updated_at": "2025-07-18T13:24:00.000Z"
  }
}
```

---

### ❌ Error Responses

**400 Bad Request**
_Validation error (e.g., missing fields or invalid data types)_

```json
{
  "message": "Validation failed",
  "errors": {
    "sku": ["The SKU must be unique"],
    "purchase_price": ["The price must be a number"]
  }
}
```

**401 Unauthorized**
_User is not authenticated (no or invalid token)_

```json
{
  "message": "Unauthorized"
}
```

**403 Forbidden**
_User does not have permission to update the product_

```json
{
  "message": "You are not allowed to perform this action"
}
```

**404 Not Found**
_Product not found_

```json
{
  "message": "Product with ID 1 not found"
}
```

**500 Internal Server Error**
_Something went wrong on the server_

```json
{
  "message": "An internal server error occurred"
}
```

---

### 🏷️ Tags: \[Products], \[Update], \[Admin]

<!-- Deleting Products By id  -->
