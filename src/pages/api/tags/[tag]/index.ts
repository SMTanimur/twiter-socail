import nc from "next-connect";
import { all } from "middlewares";
import { getPostsByTag } from "controllers/tags";

const handler = nc();

handler.use(all);
handler.get(getPostsByTag);

export default handler;
