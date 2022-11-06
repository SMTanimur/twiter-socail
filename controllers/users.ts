import { NextApiResponse } from "next";
import { ExtendedNextApiRequest } from "lib/types.api";
import User from "models/User";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import Post from "models/Post";

export const getTopUsersByFollowers = async (
  req: ExtendedNextApiRequest,
  res: NextApiResponse
) => {
  try {
    const users = await User.aggregate([
      {
        $project: {
          // TODO refactor coz I have a virtual field
          noOfFollowers: { $size: "$followers" },
          // posts: 1,
          username: 1,
          profilePicture: 1,
        },
      },
      { $sort: { noOfFollowers: -1 } },
      { $limit: 10 },
    ]);
    // const tags = await Tag.find({}).sort({ totalPosts: -1 }).limit(5);

    return res.status(200).json(users);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const searchUserByUsername = async (
  req: ExtendedNextApiRequest,
  res: NextApiResponse
) => {
  const q = req.query?.q?.toString();

  try {
    if (!q) {
      res.status(404).json({ msg: "please pass the keyword" });
    }

    //! needs upgrade to sort relevent results, use elastic search
    const users = await User.find({
      username: {
        $regex: q,
        $options: "i",
      },
    });
    // if (!user) return res.status(404).json({ msg: "User not found" });
    res.status(200).json({ users });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("server error");
  }
};

export const getUserById = async (
  req: ExtendedNextApiRequest,
  res: NextApiResponse
) => {
  const { id } = req.query;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    return res.json(user);
  } catch (error) {
    if (error.kind === "ObjectId")
      return res.status(404).json({ msg: "User not found" });
    return res.status(500).send("server error");
  }
};

export const deleteUserById = async (
  req: ExtendedNextApiRequest,
  res: NextApiResponse
) => {
  try {
    if (req.query.id !== req.user._id.toString()) {
      return res.status(401).json({ msg: " It's not your profile :(" });
    }
    const user = await User.findById(req.query.id);

    if (!user) return res.status(404).json({ msg: "User not found" });
    await Post.deleteMany({ user: user._id });
    await user.remove();

    res.status(200).json({ msg: "User deleted" });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ msg: "server error :(" });
  }
};

export const updateUserById = async (
  req: ExtendedNextApiRequest,
  res: NextApiResponse
) => {
  try {
    const { id } = req.query;

    // check auth & if it's his/her own profile
    if (!req.user || req.user._id.toString() !== id) {
      return res
        .status(401)
        .json({ msg: "unauthorized to update this profile" });
    }

    const { name, username, bio } = req.body;

    let profilePicture: string;

    if (req.file) {
      const image = await cloudinary.uploader.upload(req.file.path, {
        width: 512,
        height: 512,
        crop: "fill",
      });
      profilePicture = image.secure_url;
    }

    const oldUser = await User.findById(id);
    // update the user
    oldUser.name = name ? name : oldUser.name;
    oldUser.username = username ? username : oldUser.username;
    oldUser.bio = bio ? bio : oldUser.bio;
    oldUser.profilePicture = profilePicture
      ? profilePicture
      : oldUser.profilePicture;

    const user = await oldUser.save();

    res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: "server error :(" });
  }
};
// @ follow request PUT
// @ api/users/:id/follow
// @ private
export const followUser = async (
  req: ExtendedNextApiRequest,
  res: NextApiResponse
) => {
  const { id }: { id?: string } = req.query;
  //! 1. add the user to my following list
  //! 2. add me to the person's followers list
  try {
    if (!(await User.findById(id)))
      return res.status(404).json({ msg: "requested user not found" });
    // check if the user want's to follow himself
    if (req.user._id.toString() === id) {
      return res.status(400).json({ msg: "Ouu! You cant follow yourself :(" });
    }

    //TODO use mongoose to do it
    if (req.user.following.includes(mongoose.Types.ObjectId(id))) {
      return res.status(400).json({ msg: "Already Following" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: {
          following: mongoose.Types.ObjectId(id),
        },
      },
      { new: true }
    );

    await User.findByIdAndUpdate(
      id,
      {
        $push: {
          followers: req.user._id,
        },
      },
      { new: true }
    );

    //   if (!user) return res.status(404).json({ msg: "User not found" });
    res.json({ user });
  } catch (error) {
    console.log(error.message);

    if (error.kind === "ObjectId")
      return res.status(404).json({ msg: "User not found" });
    res.status(500).json({ msg: "server error" });
  }
};

export const unfollowUser = async (
  req: ExtendedNextApiRequest,
  res: NextApiResponse
) => {
  const { id }: { id?: string } = req.query;
  //! 1. add the user to my following list
  //! 2. add me to the person's followers list
  try {
    //TODO check auth
    //   const user = await User.findById(req.user._id);

    if (!(await User.findById(id)))
      return res.status(404).json({ msg: "requested user not found" });
    // check if the user want's to follow himself
    if (req.user._id === mongoose.Types.ObjectId(id)) {
      return res
        .status(400)
        .json({ msg: "Ouu! You cant unfollow yourself :(" });
    }

    //TODO use mongoose to do it
    if (!req.user.following.includes(mongoose.Types.ObjectId(id))) {
      // console.log("already following");
      return res.status(400).json({ msg: "You are not following yet" });
    }

    // 1. remove the id from my followings
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: {
          following: mongoose.Types.ObjectId(id),
        },
      },
      { new: true }
    );
    // 1. remove the id from the person's followers

    await User.findByIdAndUpdate(
      id,
      {
        $pull: {
          followers: req.user._id,
        },
      },
      { new: true }
    );
    // req.session.passport.user = user;
    // console.log("REQUEST after", req.user); req.user is updated in the next request using deserialize

    //   if (!user) return res.status(404).json({ msg: "User not found" });
    res.json({ user });
  } catch (error) {
    console.log(error.message);

    if (error.kind === "ObjectId")
      return res.status(404).json({ msg: "User not found" });
    res.status(500).json({ msg: "server error" });
  }
};

// @ return followers of an user
// @ api/users/:id/followers
// @ public

export const getFollowers = async (
  req: ExtendedNextApiRequest,
  res: NextApiResponse
) => {
  const { id }: { id?: string } = req.query;
  const user = await User.findById(id).populate("followers");
  if (!user) return res.status(404).json({ msg: " user not found" });
  const followers = user.followers;
  return res.json(followers);
};

// @ return followers of an user
// @ api/users/:id/followers
// @ public

export const getFollowing = async (
  req: ExtendedNextApiRequest,
  res: NextApiResponse
) => {
  // add try catch
  const { id }: { id?: string } = req.query;
  const user = await User.findById(id).populate("following");
  if (!user) return res.status(404).json({ msg: " user not found" });
  const following = user.following;
  return res.json(following);
};
