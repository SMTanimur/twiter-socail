import { NextHandler } from "next-connect";
import { NextApiResponse } from "next";
import { ExtendedNextApiRequest } from "./../lib/types.api";
import { ObjectShape } from "yup/lib/object";
import { OptionalObjectSchema } from "yup/lib/object";
export default function validate(schema: OptionalObjectSchema<ObjectShape>) {
  return async (
    req: ExtendedNextApiRequest,
    res: NextApiResponse,
    next: NextHandler
  ) => {
    // do the validation here :)
    if (["POST", "PUT"].includes(req.method)) {
      try {
        req.body = await schema.validate(req.body, {
          stripUnknown: true,
          abortEarly: false,
        });
      } catch (error) {
        return res.status(400).json({ message: error.errors });
      }
    }

    next();
  };
}
