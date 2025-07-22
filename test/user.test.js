import supertest from "supertest";
import { web } from "../src/application/web.js";
import { prisma } from "../src/application/database.js";

describe("POST /api/users/login", () => {
  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash("testpassword123", 10);
    await prisma.user.create({
      data: {
        email: "admin@stokflow.com",
        username: "admin",
        passwordHash: hashedPassword,
      },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: "admin@stokflow.com" },
    });
    await prisma.$disconnect();
  });

  it("should login user successfully", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      email: "admin@stokflow.com",
      password: "testpassword123",
    });
    console.log(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data.email).toBe("admin@stokflow.com");
    expect(result.body.data.password).toBeUndefined();
  });
});
