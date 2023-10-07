const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const cron = require("node-cron");
const addressRoutes = require("./routes/addresses");
const synchronizeAllAddresses = require("./services/synchronization");
const { PORT } = require("./constants");

const app = express();

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/cointracker", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CoinTracker API",
      version: "1.0.0",
      description: "API for tracking Bitcoin addresses and transactions",
    },
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Use the routes
app.use("/addresses", addressRoutes);

// Schedule the synchronization every 1 hour
cron.schedule("0 * * * *", synchronizeAllAddresses);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
