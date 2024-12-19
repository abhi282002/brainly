import mongoose, { Schema, Document } from "mongoose";

const ContentSchema = new Schema({
  title: String,
  link: String,
  tags: [{ type: mongoose.Types.ObjectId, ref: "Tag" }],
  userId: { type: mongoose.Types.ObjectId, ref: "User" },
});

export const ContentModel = mongoose.model("Content", ContentSchema);
