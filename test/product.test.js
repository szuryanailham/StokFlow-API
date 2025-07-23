import supertest from "supertest";
import { createTestUser, removeTestUser } from "./test-util.js";
import { web } from "../src/application/web.js";
import { logger } from "../src/application/logging.js";
describe("GET /api/products", () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("should get all products", async () => {
    const result = await supertest(web).get("/api/products").set("Authorization", "testtoken123");
    logger.info(result.body);
    expect(result.status).toBe(200);
    expect(Array.isArray(result.body.data.products)).toBe(true);
    expect(result.body.data.products.length).toBeGreaterThan(0);
  });
});
