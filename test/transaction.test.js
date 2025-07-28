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
    const res = await supertest(web).post("/api/transactions/create").set("Authorization", "testtoken123").send({
      transactionCode: "test-12345",
      transactionType: "SALE",
      totalAmount: 200000.0,
      buyerSellerName: "Testing-user",
      notes: "Testing paragraph",
      userId: 2,
    });
    expect(res.status).toBe(201);
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
    console.log(res.body);
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
