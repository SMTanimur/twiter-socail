import Post from "models/Post";
import mongoose, { Document } from "mongoose";
import { Tag } from "../lib/types";

const Schema = mongoose.Schema;

const TagSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: Post, // import the model
    },
  ],
  totalPosts: {
    type: Number,
    default: 0,
  },
});

type TagDocument = Tag & Document;

export default (mongoose.models.Tag as mongoose.Model<TagDocument>) ||
  mongoose.model<TagDocument>("Tag", TagSchema);
