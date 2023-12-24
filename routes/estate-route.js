import express from "express";

const router = express();
import {
  createListing,
  getAllListings,
  getSingleListing,
  editListing,
  deleteListing,
  getLatestProposals,
  getAllProposals,
} from "../controllers/estate-controllers.js";
import upload from "../middlewares/multer.js";
import { authenticateUser } from "../middlewares/auth.js";
import {
  validateListingInput,
  validateIdParam,
} from "../middlewares/validation.js";



router
  .route("/create-listing")
  .post(
    authenticateUser,
    upload.any("listingImgs"),
    validateListingInput,
    createListing
  );
router
  .route("/edit-listing/:id")
  .patch(
    authenticateUser,
    upload.any("listingImgs"),
    validateListingInput,
    validateIdParam,
    editListing
  );
router.route("/get-all-listigns").get(authenticateUser, getAllListings);
router.route("/get-single-listing/:id").get(getSingleListing);
router
  .route("/delete-listing/:id")
  .delete(authenticateUser, validateIdParam, deleteListing);
router.route("/get-latest-proposals").get(getLatestProposals);
router.route("/get-all-proposals").get(getAllProposals);

export default router;
