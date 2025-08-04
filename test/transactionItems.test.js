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
