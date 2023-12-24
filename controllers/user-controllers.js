import { StatusCodes } from "http-status-codes";
import User from "../models/user-model.js";
import Estate from "../models/estate-model.js";
import { promises as fs } from "fs";
import cloudinary from "cloudinary";
import mongoose from "mongoose";
import { BadRequestError, NotFoundError } from "../errors/customErrors.js";

export const getCurrentUser = async (req, res, next) => {
  const user = await User.findById(req?.user?.userId);
  const { email, userName, avatar, _id } = user;
  res
    .status(StatusCodes.OK)
    .json({ success: true, email, userName, avatar, _id });
};

export const updateUser = async (req, res, next) => {
  const newUser = { ...req.body };
  if (req.file) {
    const response = await cloudinary.v2.uploader.upload(req.file.path);
    await fs.unlink(req.file.path);
    newUser.avatar = response.secure_url;
    newUser.avatarPublicId = response.public_id;
  }
  const updatedUser = await User.findByIdAndUpdate(req.user.userId, newUser);
  updatedUser.password = newUser.password;
  updatedUser.save();
  if (req.file && updatedUser.avatarPublicId) {
    await cloudinary.v2.uploader.destroy(updatedUser.avatarPublicId);
  }
  res.status(StatusCodes.OK).json({ msg: "user updated",success: true });
};

export const DeleteUser = async (req, res, next) => {
  const deletedListings = await Estate.find({
    createdBy: req.user.userId,
  });

  for (const listing of deletedListings) {
    if (listing.imagesIds?.length > 0) {
      for (const file of listing.imagesIds) {
        await cloudinary.v2.uploader.destroy(file);
      }
    }
  }

  await Estate.deleteMany({ createdBy: req.user.userId });

  const deletedUser = await User.findByIdAndDelete(req.user.userId);
  if (deletedUser.avatarPublicId) {
    await cloudinary.v2.uploader.destroy(deletedUser.avatarPublicId);
  }

  res.status(StatusCodes.OK).json({ success: true,msg: "user deleted" });
};

export const getOwner = async (req, res, next) => {
  const { id } = req.params;
  const isValidId = mongoose.Types.ObjectId.isValid(id);
  if (!isValidId) throw new BadRequestError("invalid MongoDB id");

  const user = await User.findById(id);

  if (!user) throw new NotFoundError(`no user with id : ${id}`);
  const { email, userName } = user;

  res.status(StatusCodes.OK).json({ success: true, user: { email, userName } });
};
