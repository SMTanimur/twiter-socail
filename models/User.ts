import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

import { User } from "../lib/types";
import Post from "./Post";
import { log } from "node:console";

const UserSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
    },
    username: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    profilePicture: {
      type: String,
      default:
        "https://images.vexels.com/media/users/3/145908/preview2/52eabf633ca6414e60a7677b0b917d92-male-avatar-maker.jpg",
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },
    // people follow this user
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // people this user follow

    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  }
);

// UserSchema.set("toObject", { virtuals: true });
// UserSchema.set("toJSON", { virtuals: true });
// Virtual
UserSchema.virtual("noOfFollowers").get(function (this: UserDocument) {
  return this.followers.length;
});
UserSchema.virtual("noOfFollowing").get(function (this: UserDocument) {
  return this.following.length;
});
UserSchema.virtual("noOfPosts").get(function (this: UserDocument) {
  return this.posts.length;
});

// methods
UserSchema.methods.matchPassword = async function (
  this: UserDocument,
  enteredPassword: string
) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// middleware before saving the data
// hash the password during registration
UserSchema.pre("save", async function (this, next: Function) {
  // run oly if the password field is modified (ex: during update profile)
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

type UserDocument = User & Document;

// UserSchema.pre("deleteOne", async function (next) {
//   console.log("removing");

//   mongoose
//     .model("Post")
//     .deleteMany(
//       {
//         user: this._id,
//       },
//       (err) => console.log(err)
//     )
//     .exec();
//   next();
// });
//? Fix this type
export default (mongoose.models.User as mongoose.Model<UserDocument>) ||
  mongoose.model<UserDocument>("User", UserSchema);
// cascading
