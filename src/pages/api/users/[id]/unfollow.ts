import nextConnect from "next-connect";
import { all } from "middlewares";

import { unfollowUser } from "controllers/users";

// TODO test endpoints
const handler = nextConnect();
handler.use(all);

handler.put(unfollowUser);
export default handler;
