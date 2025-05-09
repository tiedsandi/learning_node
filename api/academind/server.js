require("dotenv").config();
const app = require("./app");
const connectDB = require("./api/config/db");

const port = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

startServer();

// const app = require("./app");

// const port = process.env.PORT || 3000;

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });
