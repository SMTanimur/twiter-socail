import connectMongo from "connect-mongo";

import session from "express-session";

export default function sessionMiddleware(
  //!TODO set types
  req: any,
  res: any,
  next: any
) {
  const options = {
    mongoUrl: process.env.MONGODB_URI,
  };

  return session({
    secret: "123456", //process.env.SESSION_SECRET
    resave: false,
    saveUninitialized: false,
    // name: "twittyCookie",
    cookie: {
      // maxAge: ,
    },
    // age
    // cookie: { secure: true, maxAge: 20 * 20 * 5, httpOnly: false }, //! don't know wtf is going on here :(
    store: connectMongo.create(options),
  })(req, res, next);
}

// https://stackoverflow.com/questions/32830488/explain-requireconnect-mongosession

// https://stackoverflow.com/questions/40381401/when-to-use-saveuninitialized-and-resave-in-express-session

// https://hoangvvo.com/blog/next-js-and-mongodb-app-1
