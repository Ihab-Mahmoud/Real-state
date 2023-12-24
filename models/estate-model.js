import mongoose from "mongoose";

const Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["sell", "rent"],
    },
    parking: {
      type: Boolean,
      default: false,
    },
    furnished: {
      type: Boolean,
      default: false,
    },
    offer: {
      type: Boolean,
      default: false,
    },
    beds: {
      type: Number,
    },
    baths: {
      type: Number,
    },
    price: {
      type: Number,
    },
    discountedPrice: {
      type: Number,
      default:0,
    },
    images: {
      type: [String],
    },
    imagesIds: {
      type: [String],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },  
  { timestamps: true }
);

export default mongoose.model("Estate", Schema);
