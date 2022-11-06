import nc from "next-connect";
import { all } from "middlewares";
import { getTopUsersByFollowers } from "controllers/users";

const handler = nc();

handler.use(all);

// returns top 5 users sorted by number of posts
handler.get(getTopUsersByFollowers);
//TODO https://stackoverflow.com/questions/32063941/how-to-sort-documents-based-on-length-of-an-array-field
export default handler;
