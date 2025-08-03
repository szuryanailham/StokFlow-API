import supertest from "supertest";
import { createTestTransaction, createTestUser, deleteTestTransaction, removeTestUser } from "./test-util.js";
import { web } from "../src/application/web.js";

describe("GET /api/transactions", () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("Should return first page with defaul as ksdmhs s t limit", async () => {
    const res = await supertest(web).get("/api/transactions?page=1&limit=10").set("Authorization", "testtoken123");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data.transactions)).toBe(true); //
    expect(res.body.data.transactions.length).toBeLessThanOrEqual(10);
  });
});

describe("POST /api/transactions/create", () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestTransaction();
  });

  afterEach(async () => {
    await removeTestUser();
    await deleteTestTransaction();
  });
  it("Should Create New Transaction", async () => {
    const randomCode = `TEST-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const res = await supertest(web).post("/api/transactions/create").set("Authorization", "testtoken123").send({
      transactionCode: randomCode,
      transactionType: "SALE",
      totalAmount: 200000.0,
      buyerSellerName: "Testing-user",
      notes: "Testing paragraph",
      userId: 2,
    });
    console.log(res.body);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("data.transactions.transactionCode", randomCode);
  });

  it("❌ Should Fail Without Authorization", async () => {
    const res = await supertest(web).post("/api/transactions/create").send({
      transactionCode: "unauthorized-code",
      transactionType: "SALE",
      totalAmount: 200000.0,
      buyerSellerName: "Testing-user",
      notes: "Testing paragraph",
      userId: 2,
    });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toBe("Unauthorized");
  });

  it("❌ Should Fail When Required Field is Missing", async () => {
    const res = await supertest(web).post("/api/transactions/create").set("Authorization", "testtoken123").send({
      transactionType: "SALE",
      totalAmount: 200000.0,
      buyerSellerName: "Testing-user",
      notes: "Testing paragraph",
      userId: 2,
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
  });

  it("❌ Should Fail When transactionCode is Duplicated", async () => {
    const res = await supertest(web).post("/api/transactions/create").set("Authorization", "testtoken123").send({
      transactionCode: "test-duplicate123",
      transactionType: "SALE",
      totalAmount: 200000.0,
      buyerSellerName: "Testing-user",
      notes: "Testing paragraph",
      userId: 2,
    });

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty("errors");
  });

  it("❌ Should Fail When userId is Invalid", async () => {
    const res = await supertest(web).post("/api/transactions/create").set("Authorization", "testtoken123").send({
      transactionCode: "test-12345",
      transactionType: "SALE",
      totalAmount: 200000.0,
      buyerSellerName: "Testing-user",
      notes: "Testing paragraph",
      userId: 99999,
    });
    console.log("BODY", res.body);
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("errors");
  });
});

describe("PATCH /api/transactions/:id", () => {
  let testTransaction;
  beforeEach(async () => {
    await createTestUser();
    testTransaction = await createTestTransaction();
  });

  afterEach(async () => {
    await removeTestUser();
    await deleteTestTransaction();
  });

  it("Should update the transaction by ID", async () => {
    const response = await supertest(web).patch(`/api/transactions/${testTransaction.id}`).set("Authorization", "testtoken123").send({
      buyerSellerName: "Updated Buyer",
      notes: "Updated notes paragraph",
    });
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body).toHaveProperty("data");

    const data = response.body.data.transactions;
    expect(data.buyerSellerName).toBe("Updated Buyer");
    expect(data.notes).toBe("Updated notes paragraph");
  });

  it("❌ Should return 404 if transaction not found", async () => {
    const invalidId = 999999;
    const response = await supertest(web).patch(`/api/transactions/${invalidId}`).set("Authorization", "testtoken123").send({
      buyerSellerName: "Doesn't Matter",
      notes: "Doesn't Matter",
    });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("errors", "Transaction not found");
  });

  it("❌ Should return 400 if validation fails", async () => {
    const response = await supertest(web).patch(`/api/transactions/${testTransaction.id}`).set("Authorization", "testtoken123").send({
      buyerSellerName: 123, // salah tipe data
      notes: null,
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors", '"buyerSellerName" must be a string');
  });

  it("❌ Should fail without Authorization", async () => {
    const response = await supertest(web).patch(`/api/transactions/${testTransaction.id}`).send({
      buyerSellerName: "No Auth",
      notes: "No Auth",
    });
    console.log(response.body);
    expect(response.status).toBe(401); // atau 403 tergantung middleware
    expect(response.body).toHaveProperty("errors", "Unauthorized");
  });
});

describe("GET /api/transactions/:id", () => {
  beforeEach(async () => {
    await createTestUser();
    testTransaction = await createTestTransaction();
  });

  afterEach(async () => {
    await removeTestUser();
    await deleteTestTransaction();
  });

  it("✅ Should return transaction detail by ID", async () => {
    const response = await supertest(web).get(`/api/transactions/${testTransaction.id}`).set("Authorization", "testtoken123");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data.transactions).toMatchObject({
      id: testTransaction.id,
      buyerSellerName: testTransaction.buyerSellerName,
      notes: testTransaction.notes,
    });
  });

  it("❌ Should return 404 if transaction not found", async () => {
    const invalidId = 999999;
    const response = await supertest(web).get(`/api/transactions/${invalidId}`).set("Authorization", "testtoken123");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("errors", "Transaction not found");
  });

  it("❌ Should return 401 if no authorization token", async () => {
    const response = await supertest(web).get(`/api/transactions/${testTransaction.id}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("errors");
  });
});

describe("DELETE /api/transactions/:id", () => {
  beforeEach(async () => {
    await createTestUser();
    testTransaction = await createTestTransaction();
  });

  afterEach(async () => {
    await removeTestUser();
    await deleteTestTransaction();
  });

  it("✅ Should delete transaction by ID", async () => {
    const response = await supertest(web).delete(`/api/transactions/${testTransaction.id}`).set("Authorization", "testtoken123");
    console.log(response.body);
    expect(response.status).toBe(200);
  });
});
