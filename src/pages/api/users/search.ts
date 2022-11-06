import nextConnect from "next-connect";
import { all } from "middlewares";
import { searchUserByUsername } from "controllers/users";

const handler = nextConnect();
handler.use(all);

handler.get(searchUserByUsername);

export default handler;
