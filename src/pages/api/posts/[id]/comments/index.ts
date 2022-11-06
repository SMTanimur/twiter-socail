import nextConnect from "next-connect";
import { all } from "middlewares";
import { createComment, getCommentsOfPostByPostId } from "controllers/comments";

const handler = nextConnect();
handler.use(all);

handler.get(getCommentsOfPostByPostId).post(createComment);

export default handler;
