import mongoose, { Document } from "mongoose";
import { Post } from "lib/types";
import User from "./User";
import Tag from "./Tag";

const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      // User ? not "User"
      ref: User,
    },
    // change this to text
    content: {
      type: String,
      required: true,
    },
    attachmentURL: {
      type: String,
    },
    cloudinaryImageId: {
      type: String,
    },
    // parentPost: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Post",
    //   default: null, // null means no parent post
    // },
    // array of user objects which only holds userid
    likes: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: User,
        },
        // likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        _id: false, //else mongoose will automatically add id; which is unnecessary
      },
    ],
    comments: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: User,
        },
        content: {
          type: String,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// create virtual fields on comment count, like count etc
type PostDocument = Post & Document;

export default (mongoose.models.Post as mongoose.Model<PostDocument>) ||
  mongoose.model<PostDocument>("Post", PostSchema);
