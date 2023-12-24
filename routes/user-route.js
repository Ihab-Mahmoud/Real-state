import express from "express";

const router = express();
import {
  getCurrentUser,
  updateUser,
  getOwner,
  DeleteUser,
} from "../controllers/user-controllers.js";
import upload from "../middlewares/multer.js";
import {
  validateUpdateUserInput,
} from "../middlewares/validation.js";


router.route("/current-user").get(getCurrentUser);
router.route("/get-owner/:id").get(getOwner);
router.route("/delete").delete(DeleteUser);
router
  .route("/update")
  .patch(upload.single("avatar"), validateUpdateUserInput, updateUser);

export default router;
