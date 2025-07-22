## 📦 Transaction API Specification

---

### 📌 1. Create Transaction

**Endpoint:**

```http
POST /api/transactions
```

**Description:**
Creates a new transaction (SALE or PURCHASE) and stores associated transaction items.

**Request Headers:**

```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "transaction_code": "INV-2025-0001",
  "transaction_type": "SALE",
  "total_amount": 150000,
  "transaction_date": "2025-07-18T10:30:00Z",
  "buyer_seller_name": "John Doe",
  "notes": "First sale",
  "user_id": 1,
  "items": [
    {
      "product_id": 3,
      "quantity": 2,
      "unit_price_at_transaction": 75000
    }
  ]
}
```

**Success Response:** `201 Created`

```json
{
  "status": "success",
  "message": "Transaction created successfully",
  "data": {
    "id": 1,
    "transaction_code": "INV-2025-0001",
    "transaction_type": "SALE",
    ...
  }
}
```

---

### 📌 2. Get All Transactions (with Pagination)

**Endpoint:**

```http
GET /api/transactions
```

**Description:**
Retrieves paginated list of all transactions.

**Query Parameters:**

| Parameter | Type   | Required | Description                    |
| --------- | ------ | -------- | ------------------------------ |
| `page`    | number | No       | Current page (default: 1)      |
| `limit`   | number | No       | Number of items per page (10)  |
| `type`    | string | No       | Filter by `SALE` or `PURCHASE` |

**Success Response:** `200 OK`

```json
{
  "status": "success",
  "data": [
    {
      /* transaction */
    },
    {
      /* transaction */
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total_pages": 5,
    "total_records": 50
  }
}
```

---

### 📌 3. Get Transaction Detail

**Endpoint:**

```http
GET /api/transactions/:id
```

**Description:**
Get a specific transaction and its items by ID.

**URL Params:**

- `id`: Transaction ID

**Success Response:** `200 OK`

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "transaction_code": "INV-2025-0001",
    "transaction_type": "SALE",
    ...
    "items": [
      {
        "product_id": 3,
        "quantity": 2,
        "unit_price_at_transaction": 75000,
        "subtotal": 150000
      }
    ]
  }
}
```

---

### 📌 4. Delete Transaction

**Endpoint:**

```http
DELETE /api/transactions/:id
```

**Description:**
Delete a transaction and its related items by ID.

**URL Params:**

- `id`: Transaction ID

**Success Response:** `200 OK`

```json
{
  "status": "success",
  "message": "Transaction deleted successfully"
}
```

---
