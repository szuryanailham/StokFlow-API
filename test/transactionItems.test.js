import supertest from "supertest";
import { createTestItemTransaction, createTestUser, deleteTestTransactionItem, removeTestUser } from "./test-util.js";
import { web } from "../src/application/web.js";

describe("GET /api/transactions/:id/items", () => {
  let Testing;

  beforeEach(async () => {
    await createTestUser();
    Testing = await createTestItemTransaction();
  });

  afterEach(async () => {
    await removeTestUser();
    await deleteTestTransactionItem();
  });

  it("Should return Items transaction by id transaction", async () => {
    const transactionId = Testing[0].transactionId;
    const response = await supertest(web).get(`/api/transactions/${transactionId}/items`).set("Authorization", "testtoken123");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  it("Should return 404 if transaction not found", async () => {
    const nonExistentId = 99999;
    const response = await supertest(web).get(`/api/transactions/${nonExistentId}/items`).set("Authorization", "testtoken123");

    console.log(response.body);
    expect(response.status).toBe(404);
  });

  it("Should return 401 if no authorization token is provided", async () => {
    const transactionId = Testing[0].transactionId;
    const response = await supertest(web).get(`/api/transactions/${transactionId}/items`);
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("errors", "Unauthorized");
  });
});

describe("POST /api/transactions/:id/items", () => {
  beforeAll(async () => {
    await createTestUser();
  });

  afterAll(async () => {
    await removeTestUser();
    await deleteTestTransactionItem();
  });

  it("Should create new transaction items", async () => {
    const requestData = [
      {
        productId: 1,
        quantity: 2,
        unitPriceAtTransaction: 10000,
        subtotal: 20000,
      },
      {
        productId: 2,
        quantity: 1,
        unitPriceAtTransaction: 15000,
        subtotal: 15000,
      },
    ];

    const response = await supertest(web).post(`/api/transactions/2/items`).set("Authorization", "testtoken123").send(requestData);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Transaction items created successfully");
  });

  it("Should return 400 if request data is invalid", async () => {
    const invalidData = [
      {
        productId: null,
        quantity: "two", // invalid quantity type
        unitPriceAtTransaction: "invalid", // invalid price
        subtotal: null,
      },
    ];

    const response = await supertest(web).post(`/api/transactions/2/items`).set("Authorization", "testtoken123").send(invalidData);

    expect(response.status).toBe(400);
  });

  it("Should return 401 if no token is provided", async () => {
    const requestData = [
      {
        productId: 1,
        quantity: 1,
        unitPriceAtTransaction: 10000,
        subtotal: 10000,
      },
    ];

    const response = await supertest(web).post(`/api/transactions/2/items`).send(requestData);

    expect(response.status).toBe(401);
  });

  it("Should return 404 if transaction ID not found", async () => {
    const requestData = [
      {
        productId: 1,
        quantity: 1,
        unitPriceAtTransaction: 10000,
        subtotal: 10000,
      },
    ];

    const response = await supertest(web).post(`/api/transactions/9999/items`).set("Authorization", "testtoken123").send(requestData);

    expect(response.status).toBe(404);
  });
});

describe("PATCH /api/transactions/:transactionId/items/:itemId", () => {
  let item;
  beforeAll(async () => {
    await createTestUser();
    const items = await createTestItemTransaction();
    item = items[0];
  });

  afterAll(async () => {
    await createTestUser();
    await deleteTestTransactionItem();
  });

  it("should update a transaction item and return 200", async () => {
    const updatedData = {
      productId: 3,
      quantity: 2,
      unitPriceAtTransaction: 15000,
      subtotal: 30000,
    };

    const response = await supertest(web).patch(`/api/transactions/${item.transactionId}/items/${item.id}`).set("Authorization", "testtoken123").send(updatedData);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Transaction item updated successfully");
  });

  it("should return 404 if item not found", async () => {
    const fakeItemId = 99999;

    const response = await supertest(web).patch(`/api/transactions/${item.transactionId}/items/${fakeItemId}`).set("Authorization", "testtoken123").send({
      productId: 1,
      quantity: 1,
      unitPriceAtTransaction: 10000,
      subtotal: 10000,
    });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("errors", "Transaction item not found");
  });

  it("should return 404 if transaction not found", async () => {
    const fakeTransactionId = 99999;

    const response = await supertest(web).patch(`/api/transactions/${fakeTransactionId}/items/${item.id}`).set("Authorization", "testtoken123").send({
      productId: 1,
      quantity: 1,
      unitPriceAtTransaction: 10000,
      subtotal: 10000,
    });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("errors", "Transaction not found");
  });

  it("should return 400 if request body is invalid", async () => {
    const invalidData = {
      productId: "invalid",
      quantity: -1,
      unitPriceAtTransaction: "not a number",
      subtotal: null,
    };

    const response = await supertest(web).patch(`/api/transactions/${item.transactionId}/items/${item.id}`).set("Authorization", "testtoken123").send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
  });
});

describe("DELETE /api/transactions/:transactionId/items/:itemId", () => {
  let Testing;

  beforeEach(async () => {
    await createTestUser();
    Testing = await createTestItemTransaction(); // ini mengembalikan array item
  });

  afterEach(async () => {
    await removeTestUser();
    await deleteTestTransactionItem();
  });

  it("Should delete a transaction item successfully", async () => {
    const transactionId = Testing[0].transactionId;
    const itemId = Testing[0].id;

    const response = await supertest(web).delete(`/api/transactions/${transactionId}/items/${itemId}`).set("Authorization", "testtoken123");

    console.log("Testing id:", itemId);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Transaction item deleted successfully");
  });

  it("Should return 404 if transaction item not found", async () => {
    const transactionId = Testing[0].transactionId;
    const nonExistentItemId = 999999;

    const response = await supertest(web).delete(`/api/transactions/${transactionId}/items/${nonExistentItemId}`).set("Authorization", "testtoken123");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("errors", "Transaction item not found");
  });
});
