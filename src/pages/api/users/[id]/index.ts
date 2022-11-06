import nextConnect from "next-connect";
import { all } from "middlewares";
import uploadMulter from "middlewares/fileUpload";
import { deleteUserById, getUserById, updateUserById } from "controllers/users";

const handler = nextConnect();
handler.use(all);
handler.use(uploadMulter().single("profilePicture"));
handler.get(getUserById).put(updateUserById).delete(deleteUserById);

export default handler;

//! Important for file handling ;because of form data; no idea what does it mean :(
export const config = {
  api: {
    bodyParser: false,
  },
};
