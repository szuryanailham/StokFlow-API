import supertest from "supertest";
import jwt from "jsonwebtoken";
import { web } from "../src/application/web.js";
import { createTestUser, removeTestUser } from "./test-util.js";
import { logger } from "../src/application/logging.js";

describe("POST /api/users/login", function () {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("Should be able to login and get JWT token", async () => {
    const response = await supertest(web).post("/api/users/login").send({
      email: "test@example.com",
      password: "rahasia",
    });

    logger.info(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.token).toBeDefined();
    expect(typeof response.body.data.token).toBe("string");
    expect(response.body.data.token.split(".").length).toBe(3);
  });
});
