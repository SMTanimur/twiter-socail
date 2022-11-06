import mongoose from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextHandler } from 'next-connect';

export default async function (
  _req: NextApiRequest,
  _res: NextApiResponse,
  next: NextHandler
) {
  try {
    await dbConnect();
  } catch (error) {
    console.log('Database Error', error.message);
  }
  next();
}

async function dbConnect() {
  // check if we have a connection to the database or if it's currently
  // connecting or disconnecting (readyState 1, 2 and 3)
  //! next js has no entry file :(
  if (mongoose.connection.readyState >= 1) {
    console.log('MIDDLEWARE : DB ALREADY CONNECTED');
    return;
  }
  console.log('DB not connected, trying to connect');

  return mongoose.connect(process.env.MONGODB_URI||"mongodb://localhost:27017/social-life");
  //   mongoose.connection.on("connected", () => {
  //     console.log("connected to mongo db");
  //   });
  //   mongoose.connection.on("error", (err) => {
  //     console.log(`db connection problem`, err);
  //   });
}
