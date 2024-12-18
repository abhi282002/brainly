import { Request, Response } from "express";

import express from "express";

const app = express();

app.get("/", (req: Request, res: Response) => {
  const userEmail = req.query.email;
  const userName = req.query.name;
  const userAge = req.query.age;

  res.send(`Email: ${userEmail} Name: ${userName} Age: ${userAge}`);

  console.log(`Email: ${userEmail} Name: ${userName} Age: ${userEmail}`);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
