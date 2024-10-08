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

app.get("/api/discounts", (req, res, next) => {
    res.json("Discounts Server UP!");
});

const CouponRoutes = require("./routes/coupons.routes");
app.use("/api/discounts/coupons", CouponRoutes);

const CampaignRoutes = require("./routes/campaigns.routes");
app.use("/api/discounts/campaign", CampaignRoutes);


// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
