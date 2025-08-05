import supertest from "supertest";
import { createTestItemTransaction, createTestUser, deleteTestTransactionItem, removeTestUser } from "./test-util.js";
import { web } from "../src/application/web.js";
import { prisma } from "../src/application/database.js";
describe("GET /api/transactions/:id/items", () => {
  let Testing;

  beforeEach(async () => {
    await createTestUser();
    Testing = await createTestItemTransaction();
  });

  afterEach(async () => {
    await removeTestUser();
    await deleteTestTransactionItem(Testing.id);
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

    const response = await supertest(web).post(`/api/transactions/2/items`).send(requestData); // no Authorization header

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
