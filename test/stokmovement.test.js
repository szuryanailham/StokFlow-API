// stock-movements.test.js
import supertest from "supertest";
import { addTestDataStokMovements, createTestUser, removeTestUser } from "./test-util.js";
import { web } from "../src/application/web.js";
import { prisma } from "../src/application/database.js";
import stockmovementService from "../src/service/stockmovement-service.js";

describe("GET /api/stock-movements", () => {
  let userData;

  beforeEach(async () => {
    userData = await createTestUser();
    await prisma.stockMovement.createMany({
      data: [
        {
          productId: 1,
          movementType: "IN",
          quantityChanged: 10,
          stockAfterMovement: 60,
          reason: "Initial stock",
          transactionItemId: null,
          userId: 2,
          movementDate: new Date(),
        },
        {
          productId: 1,
          movementType: "IN",
          quantityChanged: 10,
          stockAfterMovement: 60,
          reason: "Initial stock",
          transactionItemId: null,
          userId: 2,
          movementDate: new Date(),
        },
      ],
    });
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("should return all stock movements with default pagination", async () => {
    const response = await supertest(web).get("/api/stock-movements?limit=10&offset=0").set("Authorization", "testtoken123");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.message).toBe("Stock movements fetched successfully");
  });

  it("should return 401 if token is invalid", async () => {
    const response = await supertest(web).get("/api/stock-movements?limit=10&offset=0").set("Authorization", "Bearer invalidtoken123");
    console.log(response.body);
    expect(response.status).toBe(401);
    expect(response.body.errors).toMatch(/Unauthorized|token/i);
  });
});

describe("GET /api/products/:id/history", () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
    await prisma.stockMovement.deleteMany();
  });

  it("should return an array of stock movements for the given product ID", async () => {
    const response = await supertest(web).get("/api/products/1/history").set("Authorization", "testtoken123");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("should return 404 if product ID does not exist", async () => {
    const response = await supertest(web)
      .get("/api/products/999999/history") // assuming this ID doesn't exist
      .set("Authorization", "testtoken123");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("errors");
  });

  it("should return 401 if authorization token is missing", async () => {
    const response = await supertest(web).get("/api/products/1/history");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("errors");
  });

  it("should return 401 if authorization token is invalid", async () => {
    const response = await supertest(web).get("/api/products/1/history").set("Authorization", "invalidtoken");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("errors");
  });
});
