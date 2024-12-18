import mongoose, { Schema } from "mongoose";

const user = new Schema({
  username: { type: String, require: true, unique: true },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
});

const UserModel = mongoose.model("User", user);

export default UserModel;
