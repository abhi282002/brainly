import { Request, Response } from "express";

import express from "express";
import { connectDb } from "./db";

const app = express();
app.use(express.json());
app.get("/api/v1/signup", (req, res) => {
  const { username, email, password } = req.body;

  res.json({ username, email, password });
});

connectDb().then(() => {
  console.log("Connected to MongoDB");
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
});
