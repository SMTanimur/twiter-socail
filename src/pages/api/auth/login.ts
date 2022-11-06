import nc from "next-connect";
import { loginSchema } from "lib/schemaValidation";
import { all, passport, schemaValidate } from "middlewares";
import { login } from "controllers/auth";

const handler = nc();

handler.use(all);
handler.use(schemaValidate(loginSchema));
handler.post(passport.authenticate("local"), login);

export default handler;
