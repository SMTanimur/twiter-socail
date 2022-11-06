import nc from "next-connect";
import { all } from "middlewares";
import { me } from "controllers/auth";

const handler = nc();

handler.use(all);

handler.get(me);

export default handler;
