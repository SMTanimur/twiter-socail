import morgan from "morgan";
import nextConnect from "next-connect";
import database from "./database";
import passport from "./passport";
import session from "./session";

const all = nextConnect();

all
  .use(morgan("dev"))
  .use(database)
  .use(session)
  .use(passport.initialize())
  .use(passport.session());

export default all;
