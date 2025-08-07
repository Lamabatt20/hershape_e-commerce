const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// الاتصال بقاعدة البيانات
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // غيّرها إذا كان في باسوورد
  database: "hershape_db", // تأكد من وجود قاعدة بهذا الاسم
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL");
  }
});

// Route تجربة
app.get("/", (req, res) => {
  res.send("✅ Backend is working!");
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
