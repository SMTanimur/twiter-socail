import bcrypt from "bcryptjs";
import passport from "passport";
import { Strategy as LocalStratagy } from "passport-local";
import User from "../models/User";

// https://lavalite.org/blog/passport-serialize-and-deserialize-in-nodejs#:~:text=and%20passport.deserialize.-,Passport,user%20info%20in%20a%20callback
// https://stackoverflow.com/questions/27637609/understanding-passport-serialize-deserialize
// https://www.youtube.com/watch?v=-RCnNyD0L-s&t=2s

// http://www.passportjs.org/docs/downloads/html/

// HOW PASSPORT WORKS : http://toon.io/understanding-passportjs-authentication-flow/

const findUserByEmail = async (email: string) => {
  return await User.findOne({ email }).select("+password");
};
const findUserById = async (id: string) => {
  return await User.findOne({ _id: id }).select("+password");
};

passport.use(
  new LocalStratagy(
    {
      usernameField: "email", // password field is by default password
      //   passReqToCallback: true, // if set, retq becomes the first user, useful for additional data from the request
    },
    async (username, password, done) => {
      // check if the user exist
      const user: any = await findUserByEmail(username);

      // if(user === null) // no user exists

      if (user && (await bcrypt.compare(password, user.password))) {
        // matched, call done and pass the user
        done(null, user);
      } else {
        // uhh!!! invalid credentials
        done(null, false, { message: "Email or password is incorrect" });
      }
    }
  )
);

// TODO set type of the user

// done is the next middleware

// put the data(user id) into the session
passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

// get the serialized data(user id) from the session and retrive the user
passport.deserializeUser(async (req, id, done) => {
  try {
    const user = await findUserById(id);
    done(null, user);
  } catch (error) {
    // something went wrong :(
    done(error);
  }
});

export default passport;
