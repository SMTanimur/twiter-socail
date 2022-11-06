import nc from "next-connect";
import { all } from "middlewares";
import { getTopTags } from "controllers/tags";

const handler = nc();

handler.use(all);

handler.get(getTopTags);
//TODO https://stackoverflow.com/questions/32063941/how-to-sort-documents-based-on-length-of-an-array-field
export default handler;
