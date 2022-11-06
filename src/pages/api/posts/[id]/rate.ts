import nextConnect from "next-connect";
import { all, auth } from "middlewares";
import { ratePostById } from "controllers/posts";

const handler = nextConnect();
handler.use(all);
handler.use(auth);

handler.put(ratePostById);

export default handler;
