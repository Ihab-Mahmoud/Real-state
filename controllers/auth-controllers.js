import User from "../models/user-model.js";
import { StatusCodes } from "http-status-codes";
import { UnauthenticatedError } from "../errors/customErrors.js";
import attachCookie from "../utils/attachCookie.js";

export const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = await user.CreateToken();
  attachCookie({ res, token });

  user.password = undefined;
  res
    .status(StatusCodes.CREATED)
    .json({ msg: "User created successfully", user });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  const isPasswordCorrect = await user.ComparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Password is not correct");
  }
  const token = await user.CreateToken();
  attachCookie({ res, token });
  user.password = undefined;
  res.status(StatusCodes.OK).json({ msg: "Logged In ", token });
};

export const LoginWithGoogle = async (req, res) => {
  const { email, userName } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    const token = await user.CreateToken();
    attachCookie({ res, token });
    user.password = undefined;
    res.status(StatusCodes.OK).json({ msg: "Logged In ", user });
  } else {
    const newUser = req.body;
    newUser.userName =
      userName.split(" ").join("") + Math.random().toString(36).slice(2, 10);
    
    // generate password
    newUser.password =
      Math.random().toString(36).slice(2, 10) +
      Math.random().toString(36).slice(2, 10);
    const user = await User.create({ ...newUser });
    const token = await user.CreateToken();
    attachCookie({ res, token });

    user.password = undefined;
    res
      .status(StatusCodes.CREATED)
      .json({ success: true, user });
  }
};

export const logout = async (req, res) =>
{
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ success: true, msg: "user logged out!" });
}
