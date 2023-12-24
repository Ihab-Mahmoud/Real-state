import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const ListingCard = ({
  name,
  description,
  image,
  address,
  type,
  beds,
  baths,
  price,
  id,
}) => {
  return (
    <Link
      to={`/listing/${id}`}
      className=" max-w-[98%]  bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg cursor-pointer w-full sm:w-[330px] h-[410px] "
    >
      <img
        className="max-w-full object-cover hover:scale-110 duration-300 w-full h-[55%] "
        src={image}
        alt="estate"
      />
      <div className="pt-6 px-4 pb-4 flex flex-col gap-2">
        <h2 className=" text-lg font-semibold text-slate-700 truncate ">
          {name}
        </h2>
        <div className="flex items-center gap-1  ">
          <FaMapMarkerAlt className="text-green-800 text-sm" />
          <p className="text-xs text-gray-500 truncate ">{address}</p>
        </div>
        <p className="text-xs text-gray-500 line-clamp-2">{description}</p>
        <h4 className="text-slate-500 font-semibold">
          ${price} {type == "rent" && "/ month"}
        </h4>
        <div className="flex gap-2">
          <span className="text-xs font-bold text-slate-700">{beds} Beds</span>
          <span className="text-xs font-bold text-slate-700">
            {baths} Baths
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;
