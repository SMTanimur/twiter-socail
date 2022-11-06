import nextConnect from "next-connect";
import { all } from "middlewares";
import { deletePostById, getPostById, updatePostById } from "controllers/posts";

const handler = nextConnect({ attachParams: true });
handler.use(all);

//TODO use auth middleware only for put and delete
handler
  .get(getPostById)
  // update a post,although you can't update a post
  .put(updatePostById)
  .delete(deletePostById);

export default handler;
