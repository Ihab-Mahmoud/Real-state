import express from "express";
import rateLimiter from "express-rate-limit";

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15,
  message: { msg: "IP rate limit exceeded, retry in 15 minutes." },
});
const router = express();
import {
  register,
  login,
  LoginWithGoogle,
  logout,
} from "../controllers/auth-controllers.js";
import {
  validateLoginInput,
  validateRegisterInput,
} from "../middlewares/validation.js";


router.route("/login").post(apiLimiter,validateLoginInput, login);
router.route("/logout").get(logout);
router.route("/register").post(apiLimiter,validateRegisterInput, register);
router.route("/google").post(LoginWithGoogle);


export default router;




