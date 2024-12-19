import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { key } from "../config/config";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

declare module "jsonwebtoken" {
  export interface UserIDJwtPayload extends jwt.JwtPayload {
    _id: string;
    email: string;
    username: string;
  }
}

const validateUser = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"];
  if (!token) {
    res.status(411).json({ message: "Token not found" });
  }
  const { _id } = <jwt.UserIDJwtPayload>jwt.verify(token as string, key.secret);
  if (_id) {
    req.userId = _id;
  } else {
    res.status(403).json({ message: "You're Not LoggedIn" });
  }
  next();
};

export default validateUser;
