const express = require("express");
const multer = require("multer");
const routes = require("./src/routes");
const app = express();
const cors = require("cors");
const port = 5001;

// Middleware
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

app.get("/api", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
