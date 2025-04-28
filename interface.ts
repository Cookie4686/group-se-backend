import { UserType } from "./src/models/User.js";

declare global {
  namespace Express {
    export interface Request {
      user?: UserType | null;
    }
  }
}
