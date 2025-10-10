import { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../dist/app"; // path to compiled JS

export default (req: VercelRequest, res: VercelResponse) => {
  return app(req, res); // forward request to Express
};
