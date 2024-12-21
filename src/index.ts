import { Request, Response } from "express";

import express from "express";
import { connectDb } from "./db";
import UserModel from "./schema/user.schema";
import bcrypt from "bcrypt";
import { Schema } from "zod";
import SignUpSchema from "./validateSchema/Sign-Up-Validation";
import LoginSchema from "./validateSchema/Sign-In-Validation";
import { options } from "./config/config";
import validateUser from "./middleware/validateUser";
import { ContentModel } from "./schema/content.schema";
import { LinkModel } from "./schema/link.schema";

const app = express();
app.use(express.json());

const validate =
  (schema: Schema) => (req: Request, res: Response, next: Function) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next();
    } catch (err) {
      res.status(400).send("Invalid request");
    }
  };

app.post(
  "/api/v1/signup",
  validate(SignUpSchema),
  async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(200).json({ user });
  }
);

app.post(
  "/api/v1/login",
  validate(LoginSchema),
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      res.status(400).json({ message: "User not found" });
    }

    const isPasswordCorrect = await user!.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
      res.status(400).json({ message: "Invalid password" });
    }

    const token = await user!.generateToken(password);

    const loggedInUser = await UserModel.findById(user!._id).select(
      "-password -refreshToken"
    );

    res
      .status(200)
      .cookie("token", token, options)
      .json({ user: loggedInUser });
  }
);

app.post(
  "/api/v1/content",
  validateUser,
  async (req: Request, res: Response) => {
    const { title, link, tags } = req.body;

    const content = await ContentModel.create({
      title,
      link,
      tags: [],
      userId: req.userId,
    });

    res.status(200).json({ content });
  }
);

app.get(
  "/api/v1/content",
  validateUser,
  async (req: Request, res: Response) => {
    const contents = await ContentModel.find({ userId: req.userId }).populate(
      "userId",
      "username"
    );

    if (!contents) {
      res.status(400).json({ message: "No Content Found" });
    }

    res.status(200).json({ contents });
  }
);

app.get(
  "/api/v1/brain/share",
  validateUser,
  async (req: Request, res: Response) => {
    const { share } = req.body;
    if (share) {
      const link = await LinkModel.findOne({
        userId: req.userId,
      });
      if (link) {
        res.status(200).json({ message: "/share/" + link.hash });
        return;
      }
      const hash = crypto.randomUUID();
      await LinkModel.create({
        hash: hash,
        userId: req.userId,
      });
      res.status(200).json({ message: "/share/" + hash });
    } else {
      await LinkModel.deleteOne({
        userId: req.userId,
      });

      res.status(200).json({ message: "Link Removed Successfully" });
    }
  }
);

app.get("/api/v1/brain/:shareLink", async (req: Request, res: Response) => {
  const link = req.params.shareLink;
  const hash = await LinkModel.findOne({
    hash: link,
  });
  if (!hash) {
    res.json(411).json({ message: "Link Not Found" });
    return;
  }

  const contents = await ContentModel.find({
    userId: hash.userId,
  }).populate("userId", "username");

  if (!contents) {
    res.status(400).json({ message: "No Content Found" });
    return;
  }
  res.status(200).json({
    contents,
  });
});

connectDb().then(() => {
  console.log("Connected to MongoDB");
  app.listen(3001, () => {
    console.log("Server is running on port 3000");
  });
});
