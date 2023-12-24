import { promises as fs } from "fs";
import cloudinary from "cloudinary";
import Estate from "../models/estate-model.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/customErrors.js";
import mongoose from "mongoose";

export const createListing = async (req, res, next) => {
  const estate = { ...req.body };
  estate.createdBy = req.user.userId;
  if (req.files) {
    let Images = [];
    let ImagesIds = [];
    for (const file of req.files) {
      const response = await cloudinary.v2.uploader.upload(file.path);
      await fs.unlink(file.path);
      Images.push(response.secure_url);
      ImagesIds.push(response.public_id);
    }
    estate.images = Images;
    estate.imagesIds = ImagesIds;
  }
  estate.rent == "on" ? (estate.type = "rent") : (estate.type = "sell");
  estate.parking == "on" ? (estate.parking = true) : (estate.parking = false);
  estate.furnished == "on"
    ? (estate.furnished = true)
    : (estate.furnished = false);
  estate.offer == "on" ? (estate.offer = true) : (estate.offer = false);

  delete estate.rent;
  delete estate.sell;

  await Estate.create(estate);
  res.status(StatusCodes.CREATED).json({ success: true, estate });
};

export const getAllListings = async (req, res, next) => {
  const listings = await Estate.find({ createdBy: req.user.userId }).sort({
    createdAt: -1,
  });
  let getListings = [];
  if (listings.length > 0) {
    getListings = listings.map((list) => {
      return { name: list.name, image: list.images[0], id: list._id };
    });
  }
  res.status(StatusCodes.OK).json({ success: true, getListings });
};

export const getSingleListing = async (req, res, next) => {
  const { id } = req.params;
  const isValidId = mongoose.Types.ObjectId.isValid(id);
  if (!isValidId) throw new BadRequestError("invalid MongoDB id");

  const Listing = await Estate.findById(id);
  if (!Listing) throw new NotFoundError(`no job with id : ${ id }`);
  
  const listing = await Estate.find({ _id: id });

  res.status(StatusCodes.OK).json({ success: true, listing: listing[0] });
};

export const editListing = async (req, res, next) => {
  const newEstate = { ...req.body };
  const { id } = req.params;

  newEstate.createdBy = req.user.userId;

  if (req.files) {
    let Images = [];
    let ImagesIds = [];
    for (const file of req.files) {
      const response = await cloudinary.v2.uploader.upload(file.path);
      await fs.unlink(file.path);
      Images.push(response.secure_url);
      ImagesIds.push(response.public_id);
    }
    newEstate.images = Images;
    newEstate.imagesIds = ImagesIds;
  }
  
  newEstate.rent == "on"
    ? (newEstate.type = "rent")
    : (newEstate.type = "sell");
  newEstate.parking == "on"
    ? (newEstate.parking = true)
    : (newEstate.parking = false);
  newEstate.furnished == "on"
    ? (newEstate.furnished = true)
    : (newEstate.furnished = false);
  newEstate.offer == "on"
    ? (newEstate.offer = true)
    : (newEstate.offer = false);

  delete newEstate.rent;
  delete newEstate.sell;

  const updatedestate = await Estate.findOneAndReplace(
    { createdBy: req.user.userId, _id: id },
    newEstate
  );

  if (req.files && updatedestate.imagesIds.length > 0) {
    for (const file of updatedestate.imagesIds) {
      await cloudinary.v2.uploader.destroy(file);
    }
  }

  res.status(StatusCodes.OK).json({ success: true, newEstate });
};

export const deleteListing = async (req, res, next) => {
  const { id } = req.params;

  const deletedListing = await Estate.findByIdAndDelete(id);

  if (deletedListing.imagesIds.length > 0) {
    for (const file of deletedListing.imagesIds) {
      await cloudinary.v2.uploader.destroy(file);
    }
  }
  res.status(StatusCodes.OK).json({ success: true, msg:"Listing deleted" });
};

export const getLatestProposals = async (req, res, next) => {
  const allOffers = await Estate.find({ offer: "true" })
    .sort({
      updatedAt: -1,
    })
    .limit(4);
  const allSells = await Estate.find({ type: "sell" })
    .sort({
      updatedAt: -1,
    })
    .limit(4);
  const allRents = await Estate.find({ type: "rent" })
    .sort({
      updatedAt: -1,
    })
    .limit(4);

  res
    .status(StatusCodes.OK)
    .json({ success: true, allOffers, allRents, allSells });
};

export const getAllProposals = async (req, res, next) => {
  const { sell, rent, offer, furnished, parking, sort, search } = req.query;
  const queryObject = {};

  if (search) {
    queryObject.$or = [
      { name: { $regex: search, $options: `i` } },
      { address: { $regex: search, $options: `i` } },
    ];
  }
  if (sell) {
    queryObject.type = "sell";
  }
  if (rent) {
    queryObject.type = "rent";
  }
  if (offer) {
    queryObject.offer = true;
  }
  if (furnished) {
    queryObject.furnished = true;
  }
  if (parking) {
    queryObject.parking = true;
  }

  const sortValues = {
    newest: "-createdAt",
    oldest: "createdAt",
    "price high to low": "-price",
    "price low to high": "price",
  };

  const sortKey = sortValues[sort] || sortValues.newest;

  const limit = req.query.limit || 12;

  const proposals = await Estate.find(queryObject).sort(sortKey).limit(limit);

  const totalProposals = await Estate.countDocuments(queryObject);

  res
    .status(StatusCodes.OK)
    .json({ success: true, proposals, totalProposals, limit: limit });
};
