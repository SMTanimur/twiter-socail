import { getFeed } from "controllers/posts";
import { all, auth } from "middlewares";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.use(all);
handler.use(auth);

handler.get(getFeed);

export default handler;
// this is the query to get the posts of your followers 👇
// const posts = await Post.find({ user: { $in: user.following } })
//   .populate({ path: "user", select: "name username" })
//   .sort("-createdAt");
