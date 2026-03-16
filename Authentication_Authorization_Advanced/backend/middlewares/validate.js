import sanitize from "mongo-sanitize";
import { formatZodError } from "../config/zod.js";

const validate = (schema) => (req, res, next) => {
  const sanitizedData = sanitize(req.body);
  const result = schema.safeParse(sanitizedData);

  if (!result.success) {
    return res.status(400).json(formatZodError(result.error));
  }

  req.validated = result.data;
  next();
};

export default validate;
