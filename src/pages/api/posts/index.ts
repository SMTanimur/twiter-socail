import nextConnect from "next-connect";
import { uploadMulter, all } from "middlewares";
import { createPost, getPosts } from "controllers/posts";

const handler = nextConnect();

handler.use(all);

handler.use(uploadMulter().single("attachment"));

handler
  //? /api/posts?uid=<> => returns posts by user id
  //? /api/posts  => returns all posts
  .get(getPosts)
  // create a post
  .post(createPost);

export default handler;
export const config = {
  api: {
    bodyParser: false,
  },
};
