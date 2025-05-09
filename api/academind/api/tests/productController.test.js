const productController = require("../controllers/productController");

// ⚠️ Unit test controller baru penting kalau:

// kamu punya logika berat/kompleks di dalam controller (misal hitung diskon, transform data, dsb.)

// kamu mau testing super cepat tanpa akses database atau server

describe("Product Controller", () => {
  it("should have getAllProducts function", () => {
    expect(typeof productController.getAllProducts).toBe("function");
  });
});
