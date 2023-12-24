import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../errors/customErrors.js";
import * as dotenv from "dotenv";
dotenv.config();


export const authenticateUser = async (req, res, next) =>
{
  const { token } = req.cookies; 
  if (!token) {
    throw new UnauthorizedError("authentication 5 invalid");
  }
  try
  {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    const { userId } = user;
    req.user = { userId };
    next();
  } catch (error) {
    throw new UnauthorizedError("authentication invalid");
  }
};  
