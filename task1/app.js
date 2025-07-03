const express = require("express");
const dotenv = require("dotenv");
const connectMongo = require("./db/mongo");
const mysql = require("./db/mysql");
const createVisaTable = require("./models/mysqlVisaModel");
const visaRoutes = require("./routes/visaRoutes");

dotenv.config();
const app = express();
app.use(express.json());

connectMongo();
createVisaTable();

app.use("/visa-requirements", visaRoutes);
app.get("/", (req, res) => {
  res.send("✅ Saathi Task 1 backend is deployed and running!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
