Here's the **corrected and cleaned version** of your API documentation including a fixed section for deleting products by ID. The formatting is consistent and ready for Markdown or Notion documentation use.

---

## 🗑️ Delete Product By ID

### **Endpoint**

```http
DELETE /api/products/:id
```

### **Description**

Deletes a product from the database by its ID. This operation is irreversible and also deletes related stock movement history if applicable.

---

### 🔐 Headers

```http
Authorization: Bearer <your_token_here>
```

---

### 📥 Request Body

No request body is required.

---

### ✅ Success Response — 200 OK

```json
{
  "status": "success",
  "message": "Product deleted successfully"
}
```

---

### ❌ Error Responses

**401 Unauthorized**
If the user is not logged in or token is invalid.

```json
{
  "status": "error",
  "message": "Unauthorized access. Please log in."
}
```

**403 Forbidden**
If the user does not have permission to delete the product.

```json
{
  "status": "error",
  "message": "You are not allowed to delete this product"
}
```

**404 Not Found**
If the product ID does not exist.

```json
{
  "status": "error",
  "message": "Product with ID 17 not found"
}
```

**500 Internal Server Error**
If something goes wrong on the server side.

```json
{
  "status": "error",
  "message": "An internal server error occurred"
}
```

---

### 🏷️ Tags: \[Products], \[Delete], \[Admin]
