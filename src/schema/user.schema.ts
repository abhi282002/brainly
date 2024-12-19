import bcrypt from "bcrypt";
import mongoose, { Schema, Document } from "mongoose";
import jwt from "jsonwebtoken";
import { key } from "../config/config";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  isPasswordCorrect: (password: string) => Promise<boolean>;
  generateToken: (password: string) => Promise<string>;
}

const user = new Schema({
  username: { type: String, require: true, unique: true },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
});

user.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

user.methods.generateToken = async function (password: string) {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },
    key.secret
  );
};

const UserModel = mongoose.model<IUser>("User", user);

export default UserModel;
