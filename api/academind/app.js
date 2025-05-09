const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const { swaggerUi, specs } = require("./swagger");

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const userRoutes = require("./api/routes/user");
const errorHandler = require("./api/middleware/errorHandler");

const app = express();

// const mongoUri = `mongodb+srv://user:${process.env.MONGO_ATLAS_PW}@cluster0.dx1mrdp.mongodb.net/academind?retryWrites=true&w=majority`;

// mongoose
//   .connect(mongoUri)
//   .then(() => console.log("MongoDB connected!"))
//   .catch((err) => console.error(err));

app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors());

// cara manual menulis cors
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   if (req.method === 'OPTIONS') {
//       res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
//       return res.status(200).json({});
//   }
//   next();
// });

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/users", userRoutes);

app.use((req, res, next) => {
  const error = new Error("Route Not found");
  error.status = 404;
  next(error);
});

app.use(errorHandler);

module.exports = app;
