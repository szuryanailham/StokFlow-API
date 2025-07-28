Here’s a **comprehensive set of testing scenarios** for the `POST /api/transactions/create` endpoint, including both **success** and various **error** cases. These help ensure your endpoint is resilient, validated, and functions as expected.

---

### ✅ 1. **Successful Transaction Creation**

**Scenario:** Create a valid transaction
**Input:**

```json
{
  "transactionCode": "test-12345",
  "transactionType": "SALE",
  "totalAmount": 200000.0,
  "buyerSellerName": "Testing-user",
  "notes": "Testing paragraph",
  "userId": 2
}
```

**Expected Response:**

- Status: `201 Created`
- Body:

```json
{
  "message": "Transaction created successfully",
  "data": {
    "id": 1,
    "transactionCode": "test-12345",
    "transactionType": "SALE",
    "totalAmount": 200000.0,
    "buyerSellerName": "Testing-user",
    "notes": "Testing paragraph",
    "userId": 2,
    "transactionDate": "2025-07-28T08:00:00.000Z"
  }
}
```

---

### ❌ 2. **Missing Required Field**

**Scenario:** Missing `transactionCode`
**Input:**

```json
{
  "transactionType": "SALE",
  "totalAmount": 200000.0,
  "buyerSellerName": "Testing-user",
  "notes": "Testing paragraph",
  "userId": 2
}
```

**Expected Response:**

- Status: `400 Bad Request`
- Body:

```json
{
  "error": "transactionCode is required"
}
```

---

### ❌ 3. **Invalid Enum for `transactionType`**

**Scenario:** Send unsupported transaction type
**Input:**

```json
{
  "transactionCode": "test-12345",
  "transactionType": "DONATION",
  "totalAmount": 200000.0,
  "buyerSellerName": "Testing-user",
  "notes": "Testing paragraph",
  "userId": 2
}
```

**Expected Response:**

- Status: `400 Bad Request`
- Body:

```json
{
  "error": "transactionType must be either 'SALE' or 'PURCHASE'"
}
```

---

### ❌ 4. **Negative `totalAmount`**

**Scenario:** Invalid amount value
**Input:**

```json
{
  "transactionCode": "test-12345",
  "transactionType": "SALE",
  "totalAmount": -50000.0,
  "buyerSellerName": "Testing-user",
  "notes": "Negative amount test",
  "userId": 2
}
```

**Expected Response:**

- Status: `400 Bad Request`
- Body:

```json
{
  "error": "totalAmount must be a positive number"
}
```

---

### ❌ 5. **Duplicate `transactionCode`**

**Scenario:** Use existing transaction code
**Input:**

```json
{
  "transactionCode": "test-12345", // Already used
  "transactionType": "SALE",
  "totalAmount": 100000,
  "buyerSellerName": "Duplication test",
  "notes": "Testing duplicate",
  "userId": 2
}
```

**Expected Response:**

- Status: `409 Conflict`
- Body:

```json
{
  "error": "Transaction with the same code already exists"
}
```

---

### ❌ 6. **User Not Found**

**Scenario:** Invalid `userId`
**Input:**

```json
{
  "transactionCode": "test-99999",
  "transactionType": "SALE",
  "totalAmount": 100000,
  "buyerSellerName": "Unknown user",
  "notes": "Invalid userId",
  "userId": 9999
}
```

**Expected Response:**

- Status: `404 Not Found`
- Body:

```json
{
  "error": "User not found"
}
```

---

### ❌ 7. **Unauthorized Request**

**Scenario:** No `Authorization` header
**Expected Response:**

- Status: `401 Unauthorized`
- Body:

```json
{
  "error": "Unauthorized"
}
```

---

### ❌ 8. **Invalid Payload Format**

**Scenario:** Send wrong data type
**Input:**

```json
{
  "transactionCode": 12345, // should be string
  "transactionType": "SALE",
  "totalAmount": "two hundred", // should be number
  "buyerSellerName": true, // should be string
  "notes": {},
  "userId": "abc"
}
```

**Expected Response:**

- Status: `400 Bad Request`
- Body:

```json
{
  "error": "Invalid input format"
}
```

---

### ✅ 9. **Minimal Valid Payload (if allowed)**

**Scenario:** Optional fields omitted
**Input:**

```json
{
  "transactionCode": "minimal-1",
  "transactionType": "SALE",
  "totalAmount": 10000,
  "userId": 2
}
```

**Expected Response:**

- Status: `201 Created`
- Body includes default values or null for optional fields like `buyerSellerName`, `notes`.

---
