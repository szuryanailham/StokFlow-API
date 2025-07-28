import supertest from "supertest";
import { createTestUser, removeTestUser, createTestProduct, removeTestProducts } from "./test-util.js";
import { web } from "../src/application/web.js";

describe("GET /api/transactions", () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("Should return first page with default limit", async () => {
    const res = await supertest(web).get("/api/transactions?page=1&limit=10").set("Authorization", "testtoken123");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data.transactions)).toBe(true); //
    expect(res.body.data.transactions.length).toBeLessThanOrEqual(10);
  });
});
