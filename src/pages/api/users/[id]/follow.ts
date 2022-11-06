import { NextApiResponse } from "next";
import nextConnect from "next-connect";
import { ExtendedNextApiRequest } from "lib/types.api";
import { all } from "middlewares";
import User from "models/User";
import mongoose from "mongoose";
import { followUser } from "controllers/users";

// TODO test endpoints
const handler = nextConnect();
handler.use(all);

// @ follow request PUT
// @ api/users/:id/follow
// @ private

handler.put(followUser);
export default handler;
