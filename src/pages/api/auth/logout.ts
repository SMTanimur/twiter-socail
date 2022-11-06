import nc from "next-connect";
import { all } from "middlewares";
import { logout } from "controllers/auth";

const handler = nc();

handler.use(all);

handler.post(logout);

export default handler;
