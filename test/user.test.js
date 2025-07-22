import supertest from "supertest";
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

  // IF TESTING IS SUCCESFULLY ....
  it("Should be able to login", async () => {
    const response = await supertest(web).post("/api/users/login").send({
      email: "test@example.com",
      password: "rahasia",
    });

    logger.info(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.token).toBeDefined();
    expect(response.body.data.token).not.toBe("test");
  });

  // IF TESTTING RETURN 400 ( REQUEST INVALID )....
  it("Should rejected login if request is invalid", async () => {
    const response = await supertest(web).post("/api/users/login").send({
      email: "",
      password: "",
    });

    logger.info(response.body);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  // IF TESTING RETURN 401 ( REQUEST EMAIL OR PASSWORD IS WRONG )
  it("Should rejected login if password is wrong", async () => {
    const response = await supertest(web).post("/api/users/login").send({
      email: "test@example.com",
      password: "wrong",
    });

    logger.info(response.body);
    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });

  it("Should rejected login if gmail is wrong", async () => {
    const response = await supertest(web).post("/api/users/login").send({
      email: "salah@example.com",
      password: "rahasia",
    });

    logger.info(response.body);
    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });
});
