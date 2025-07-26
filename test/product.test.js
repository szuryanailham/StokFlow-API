import supertest from "supertest";
import { createTestUser, removeTestUser, removeTestProducts, createTestProduct } from "./test-util.js";
import { web } from "../src/application/web.js";

const request = supertest(web);
describe("GET /api/products", () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
    await removeTestProducts();
  });

  it("Should Get Detail Products", async () => {
    const result = await supertest(web).get("/api/products").set("Authorization", "testtoken123");
    expect(result.status).toBe(200);
    expect(Array.isArray(result.body.data.products)).toBe(true);
    expect(result.body.data.products.length).toBeGreaterThan(0);
  });
});

describe("POST /api/prodcuts", () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestProducts();
    await removeTestUser();
  });
  it("Should Create New Products", async () => {
    const response = await supertest(web).post("/api/products").set("Authorization", "testtoken123").send({
      sku: "test12345",
      productName: "Test Product 1",
      description: "This is a test product",
      purchasePrice: 10000.0,
      sellingPrice: 10000.0,
      currentStockQty: 20,
      minStockThreshold: 5,
    });

    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty("id");
    expect(response.body.data.sku).toBe("test12345");
    expect(response.body.data.productName).toBe("Test Product 1");
  });

  it("Should return 400 if required field is missing", async () => {
    const response = await supertest(web).post("/api/products").set("Authorization", "testtoken123").send({
      productName: "Invalid Product",
      purchasePrice: 10000.0,
      sellingPrice: 12000.0,
      currentStockQty: 20,
      minStockThreshold: 5,
    });

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it("Should return 400 if field is empty", async () => {
    const response = await supertest(web).post("/api/products").set("Authorization", "testtoken123").send({
      sku: "",
      productName: "",
      purchasePrice: 10000.0,
      sellingPrice: 12000.0,
      currentStockQty: 20,
      minStockThreshold: 5,
    });

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it("Should return 409 if SKU already exists", async () => {
    // Buat produk pertama
    await supertest(web).post("/api/products").set("Authorization", "testtoken123").send({
      sku: "duplikatSKU",
      productName: "Produk A",
      purchasePrice: 10000.0,
      sellingPrice: 12000.0,
      currentStockQty: 20,
      minStockThreshold: 5,
    });

    const response = await supertest(web).post("/api/products").set("Authorization", "testtoken123").send({
      sku: "duplikatSKU",
      productName: "Produk B",
      purchasePrice: 15000.0,
      sellingPrice: 18000.0,
      currentStockQty: 10,
      minStockThreshold: 2,
    });
    expect(response.status).toBe(409);
    expect(response.body.errors).toBeDefined();
  });

  it("Should return 400 if purchasePrice is not a number", async () => {
    const response = await supertest(web).post("/api/products").set("Authorization", "testtoken123").send({
      sku: "testsku999",
      productName: "Produk Invalid",
      purchasePrice: "bukan angka",
      sellingPrice: 12000.0,
      currentStockQty: 10,
      minStockThreshold: 2,
    });

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it("Should return 400 if extra field is provided", async () => {
    const response = await supertest(web).post("/api/products").set("Authorization", "testtoken123").send({
      sku: "test-extra123",
      productName: "Produk Ekstra",
      purchasePrice: 10000.0,
      sellingPrice: 12000.0,
      currentStockQty: 10,
      minStockThreshold: 2,
      extraField: "tidak valid", // tidak seharusnya ada
    });
    console.log(response.body);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it("Should return 401 if no token is provided", async () => {
    const response = await supertest(web).post("/api/products").send({
      sku: "testsku401",
      productName: "Produk Unauthorized",
      purchasePrice: 10000.0,
      sellingPrice: 12000.0,
      currentStockQty: 10,
      minStockThreshold: 2,
    });

    expect(response.status).toBe(401);
    expect(response.body.errors).toMatch("Unauthorized");
  });

  describe("GET /api/products/:id", () => {
    let testProduct;

    beforeEach(async () => {
      await removeTestProducts();
      testProduct = await createTestProduct();
    });

    afterEach(async () => {
      await removeTestProducts();
    });

    it("should return 200 and product detail for valid ID", async () => {
      const response = await request.get(`/api/products/${testProduct.id}`).set("Authorization", `testtoken123`);
      console.log(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.id).toBe(testProduct.id);
      expect(response.body.data.sku).toBe(testProduct.sku);
    });

    it("should return 404 if product is not found", async () => {
      const nonExistingId = "999999";
      const response = await request.get(`/api/products/${nonExistingId}`).set("Authorization", `testtoken123`);
      console.log(response.body);
      expect(response.status).toBe(404);
      expect(response.body.errors).toMatch(/not found/i);
    });

    // it("should return 401 if no token is provided", async () => {
    //   const response = await request.get(`/api/products/${testProduct.id}`);

    //   expect(response.status).toBe(401);
    //   expect(response.body.errors).toMatch(/unauthorized/i);
    // });
  });
});
