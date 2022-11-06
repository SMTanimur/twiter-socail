import nextConnect from "next-connect";
import { all } from "middlewares";
import { getFollowing } from "controllers/users";

const handler = nextConnect();
handler.use(all);

handler.get(getFollowing);

export default handler;
