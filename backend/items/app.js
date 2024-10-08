// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");
const cors = require('cors');
const app = express();

app.use(cors({
    origin: '*'
}));


// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

app.get("/api/items", (req, res, next) => {
    res.json("Items Server UP!");
});

const itemsRoutes = require("./routes/items.routes");
app.use("/api/items/items", itemsRoutes);

const DietaryRoutes = require("./routes/dietary.routes");
app.use("/api/items/dietary", DietaryRoutes);

const OrdersRoutes = require("./routes/orders.routes");
app.use("api/items/orders", OrdersRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
