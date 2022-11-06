import { ExtendedNextApiRequest } from "lib/types.api";
import { NextApiResponse } from "next";
import extractUser from "lib/extractUser";
import User from "models/User";

export const login = (req: ExtendedNextApiRequest, res: NextApiResponse) => {
  res.json(req.user);
};
export const logout = (req: ExtendedNextApiRequest, res: NextApiResponse) => {
  req.logOut();
  res.status(204).end();
};

//? /api/auth/me
export const me = (req: ExtendedNextApiRequest, res: NextApiResponse) => {
  if (!req.user) return res.status(401).json({ user: null });
  return res.json(extractUser(req.user));
};
export const signup = async (
  req: ExtendedNextApiRequest,
  res: NextApiResponse
) => {
  const { name, username, email, password } = req.body;

  try {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(403).json({ message: "Email already exists" });
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(403).json({ message: "Username already exists" });
    }

    // if not, hash the password
    // insert the user in db

    const user = await User.create({ name, username, email, password });

    // send user as the response | 201    //?  http://www.passportjs.org/docs/login/

    req.login(user, (err) => {
      if (err) throw err;
      res.status(201).json(extractUser(req.user));
    });
  } catch (error) {
    res.status(500).json({ message: "Server Broken :(" });
  }
};
