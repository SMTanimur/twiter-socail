import nextConnect from "next-connect";
import { registrationSchema } from "lib/schemaValidation";

import { all, schemaValidate } from "middlewares";
import { signup } from "controllers/auth";

//? Ref : https://www.youtube.com/watch?v=ZG7sLbI8kL8&t=1163s | Bruno A.

const handler = nextConnect();

handler.use(all);

handler.use(schemaValidate(registrationSchema));

handler.post(signup);

export default handler;
