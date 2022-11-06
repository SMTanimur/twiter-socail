import { NextApiRequest } from "next";
import { User } from "./types";

export interface ExtendedNextApiRequest extends NextApiRequest {
  session: {};
  user: User;
  file: {
    filename: string;
    path: string;
  };
  logOut: Function;
  login: Function;
}
