## 📦 Audit Stock

### **GET /api/stock-movements**

**Description:** Retrieve a paginated list of all stock movement history (audit trail) for products.

**Request Headers:**

```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Query Parameters:**

| Name       | Type   | Description                  |
| ---------- | ------ | ---------------------------- |
| page       | number | Page number (default: 1)     |
| limit      | number | Number of records per page   |
| product_id | number | (optional) Filter by product |

**Success Response:**

```json
{
  "data": [
    {
      "id": 1,
      "product_id": 3,
      "movement_type": "IN",
      "quantity_changed": 50,
      "stock_after_movement": 150,
      "reason": "Initial stock",
      "transaction_item_id": null,
      "movement_date": "2025-07-18T10:30:00Z",
      "user_id": 1
    }
  ],
  "pagination": {
    "total": 30,
    "page": 1,
    "limit": 10
  }
}
```

**Error Responses:**

```json
// 401 Unauthorized
{
  "message": "Unauthorized access. Please log in."
}

// 500 Internal Server Error
{
  "message": "An unexpected error occurred. Please try again later."
}
```

---

## 🚨 Low Stock Notification

### **GET /api/products/low-stock**

**Description:** Get a paginated list of products with low stock (below the minimum threshold).

**Request Headers:**

```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Query Parameters:**

| Name  | Type   | Description                |
| ----- | ------ | -------------------------- |
| page  | number | Page number (default: 1)   |
| limit | number | Number of records per page |

**Success Response:**

```json
{
  "data": [
    {
      "id": 10,
      "name": "USB Hub",
      "stock": 3,
      "min_stock": 5
    }
  ],
  "pagination": {
    "total": 5,
    "page": 1,
    "limit": 10
  }
}
```

**Error Responses:**

```json
// 401 Unauthorized
{
  "message": "Unauthorized access. Please log in."
}

// 500 Internal Server Error
{
  "message": "Failed to fetch low stock data."
}
```

---

## 📄 Product Transaction History

### **GET /api/products/\:id/transaction-history**

**Description:** Retrieve a paginated list of all transactions involving a specific product.

**Request Headers:**

```http
Authorization: Bearer <token>
Content-Type: application/json
```

**URL Parameters:**

- `:id` = Product ID

**Query Parameters:**

| Name  | Type   | Description                |
| ----- | ------ | -------------------------- |
| page  | number | Page number (default: 1)   |
| limit | number | Number of records per page |

**Success Response:**

```json
{
  "data": [
    {
      "transaction_id": 1,
      "transaction_code": "INV-00123",
      "transaction_type": "SALE",
      "quantity": 2,
      "unit_price_at_transaction": 75000,
      "subtotal": 150000,
      "transaction_date": "2025-07-17T14:00:00Z"
    }
  ],
  "pagination": {
    "total": 12,
    "page": 1,
    "limit": 10
  }
}
```

**Error Responses:**

```json
// 401 Unauthorized
{
  "message": "Unauthorized access. Please log in."
}

// 404 Not Found
{
  "message": "Product with ID 17 not found."
}

// 500 Internal Server Error
{
  "message": "Failed to load transaction history for this product."
}
```

---
