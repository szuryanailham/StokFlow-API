// stock-movements.test.js
import supertest from "supertest";
import { addTestDataStokMovements, createTestUser, removeTestUser } from "./test-util.js";
import { web } from "../src/application/web.js";
import { prisma } from "../src/application/database.js";

describe("GET /api/stock-movements", () => {
  let token;

  beforeEach(async () => {
    const result = await createTestUser();
    token = result.token;
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
    const response = await supertest(web).get("/api/stock-movements?limit=10&offset=0").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.message).toBe("Stock movements fetched successfully");
  });

  it("should return 401 if token is invalid", async () => {
    const response = await supertest(web).get("/api/stock-movements?limit=10&offset=0").set("Authorization", `Bearer invalidtoken123`);
    console.log(response.body);
    expect(response.status).toBe(401);
    expect(response.body.errors).toMatch(/Unauthorized|token/i);
  });
});

describe("GET /api/products/:id/history", () => {
  let token;
  beforeEach(async () => {
    const result = await createTestUser();
    token = result.token;
  });

  afterEach(async () => {
    await removeTestUser();
    await prisma.stockMovement.deleteMany();
  });

  it("should return an array of stock movements for the given product ID", async () => {
    const response = await supertest(web).get("/api/products/1/history").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("should return 404 if product ID does not exist", async () => {
    const response = await supertest(web).get("/api/products/999999/history").set("Authorization", "testtoken123").set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("errors");
  });

  it("should return 401 if authorization token is missing", async () => {
    const response = await supertest(web).get("/api/products/1/history");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("errors");
  });

  it("should return 401 if authorization token is invalid", async () => {
    const response = await supertest(web).get("/api/products/1/history").set("Authorization", `Bearer invalidToken`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("errors");
  });
});

describe("GET /api/stock-movements/low-stock-alerts", () => {
  let product;
  let token;
  beforeEach(async () => {
    const result = await createTestUser();
    token = result.token;
    // Arrange: create a product with low stock
    product = await prisma.product.create({
      data: {
        sku: "lowstock123",
        productName: "Test Product Low Stock",
        description: "This is a low stock product for testing.",
        purchasePrice: 1000,
        sellingPrice: 1500,
        currentStockQty: 2,
        minStockThreshold: 5,
      },
    });
  });

  afterEach(async () => {
    await removeTestUser();
    await prisma.product.delete({
      where: {
        sku: "lowstock123",
      },
    });
  });

  it("should return an array of low stock alerts when products are below threshold", async () => {
    const response = await supertest(web).get("/api/stock-movements/low-stock-alerts").set("Authorization", `Bearer ${token}`);
    console.log(response.body);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty("productName", product.productName);
  });
});
