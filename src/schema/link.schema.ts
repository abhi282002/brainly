import mongoose, { Schema } from "mongoose";

const LinkSchema = new Schema({
  hash: { type: String, unique: true },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
});

export const LinkModel = mongoose.model("Link", LinkSchema);
