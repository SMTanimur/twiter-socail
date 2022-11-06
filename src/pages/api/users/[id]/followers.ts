import nextConnect from "next-connect";
import { all } from "middlewares";
import { getFollowers } from "controllers/users";

const handler = nextConnect();
handler.use(all);

handler.get(getFollowers);

export default handler;
