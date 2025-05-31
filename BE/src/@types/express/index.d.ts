import { IUserDocument } from "../../models/user.model";
//Custom Request Objects:
declare global {
  namespace Express {
    interface Request {
      user?: IUserDocument;
    }
  }
}
