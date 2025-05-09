const request = require("supertest");
const app = require("../../app");
const mongoose = require("mongoose");
const Product = require("../models/product");
const path = require("path");

let token;
let createdProductId;

beforeAll(async () => {
  await require("../../server");

  const res = await request(app).post("/users/login").send({
    email: "fachransandi@gmail.com",
    password: "12345678",
  });
  token = res.body.token;
});

afterAll(async () => {
  if (createdProductId) {
    await Product.deleteOne({ _id: createdProductId });
  }
  await mongoose.connection.close();
});

describe("Product Routes", () => {
  it("GET /products should return 200 and list of products", async () => {
    const res = await request(app).get("/products");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("count");
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("POST /products should create a new product", async () => {
    const res = await request(app)
      .post("/products")
      .set("Authorization", "Bearer " + token)
      .field("name", "Test Product " + Date.now())
      .field("price", 99.99)
      .attach("productImage", path.resolve(__dirname, "files/test-image.png"));

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("createdProduct");
    createdProductId = res.body.createdProduct._id;
  });

  it("GET /products/:id should return product details", async () => {
    const res = await request(app).get(`/products/${createdProductId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.product).toHaveProperty("_id", createdProductId);
  });

  it("PATCH /products/:id should update the product", async () => {
    const res = await request(app)
      .patch(`/products/${createdProductId}`)
      .set("Authorization", "Bearer " + token)
      .field("name", "Updated Product")
      .field("price", 199.99);

    expect(res.statusCode).toBe(200);
    expect(res.body.product.name).toBe("Updated Product");
  });

  it("DELETE /products/:id should delete the product", async () => {
    const res = await request(app)
      .delete(`/products/${createdProductId}`)
      .set("Authorization", "Bearer " + token);

    expect(res.statusCode).toBe(200);
    createdProductId = null;
  });
});
