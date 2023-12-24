import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import axios from "axios";
import { useLoaderData, useNavigation, useOutletContext } from "react-router";
import SubmitButton from "../components/SubmitButton";
import {
  FaBed,
  FaParking,
  FaChair,
  FaBath,
  FaShare,
  FaMapMarkerAlt,
} from "react-icons/fa";
import ContactLord from "../components/ContactLord";
export const Loader = async ({ params }) => {
  try {
    const { data } = await axios.get(
      `/api/v1/estate/get-single-listing/${params.id}`
    );
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const Listing = () => {
  SwiperCore.use([Navigation]);
  const { listing } = useLoaderData();
  const { data } = useOutletContext();
  const [contact, setContact] = useState(false);
  const ref = useRef(null);
  const navigation = useNavigation();
  const onclick = () =>
  {
    setContact(true);
  }

  const linkcopyHandle = () => {
    navigator.clipboard.writeText(window.location.href);
    console.log(ref.current.style);
    ref.current.style.display = "block";
    setTimeout(() => {
      ref.current.style.display = "none";
    }, 3000);
  };
  return (
    <div>
      <FaShare
        onClick={linkcopyHandle}
        className="text-slate-600 w-10 h-10 rounded-full p-3 bg-white text-base fixed  right-2 top-20 z-10 cursor-pointer  "
      />
      <span
        ref={ref}
        className="text-slate-600  rounded-lg p-2 bg-white text-base fixed hidden right-16 top-32 z-10 duration-3000   "
      >
        Link Copied !
      </span>
      <Swiper navigation>
        {listing?.images.map((image) => {
          return (
            <SwiperSlide key={image}>
              <div
                className="h-[550px]"
                style={{
                  background: `url(${image}) center no-repeat`,
                  backgroundSize: `cover`,
                }}
              ></div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      <div className="flex flex-col items-center">
        <div className=" sm:max-w-3xl pb-16 mx-5 sm:mx-auto sm:min-w-[60%] ">
          <h1 className="py-7 text-2xl sm:text-4xl font-semibold">
            {listing?.name} - ${" "}
            {listing?.discountedPrice > 0
              ? listing?.discountedPrice
              : listing?.price}
          </h1>
          <div className="mb-1 text-sm font-semibold text-slate-600 flex items-center gap-2 ">
            <FaMapMarkerAlt className="text-green-700" /> {listing?.address}
          </div>
          <div className="flex gap-5 items-center">
            <span className="bg-red-900 text-white text-center py-1 w-32 sm:w-52  rounded-lg">
              {listing?.sell == "true" ? "For sale" : "For rent"}
            </span>
            {listing?.discountedPrice > 0 && (
              <span className="bg-green-900 text-white  text-center py-1 w-32 sm:w-52 rounded-lg">
                ${listing?.price - listing?.discountedPrice} discount
              </span>
            )}
          </div>
          <p className="my-3 text-slate-600 ">
            <span className="font-semibold text-base text-black">
              Description -
            </span>
            {listing?.description}
          </p>
          <ul className="flex gap-1 sm:gap-4 items-center sm:justify-start mb-16 justify-between">
            <li className="flex items-center gap-1 justify-center  text-slate-700 text-[10px] sm:text-sm font-semibold">
              <FaBed className="text-xl" />
              <span>{listing?.beds} Beds</span>
            </li>
            <li className="flex items-center gap-1 text-slate-700 text-xs sm:text-sm font-semibold text-[10px]">
              <FaBath className="text-xl" />
              <span>{listing?.baths} Baths</span>
            </li>
            <li className="flex items-center gap-1 text-slate-700 text-xs sm:text-sm font-semibold text-[10px]">
              <FaParking className="text-xl" />
              <span>{listing?.parking == "false" ? "No" : ""} Parking spot</span>
            </li>
            <li className="flex items-center gap-1 text-slate-700 text-xs sm:text-sm font-semibold text-[10px]">
              <FaChair className="text-xl" />
              <span>{listing?.furnished == "fales" ? "Not" : ""} Furnished</span>
            </li>
          </ul>
          {listing?.createdBy !== data?._id && !contact && (
            <SubmitButton
              type="button"
              color="slate"
              text="contact landlord"
              onclick={onclick}
            />
          )}
          {contact && <ContactLord data={data} listing={listing} />}
        </div>
      </div>
    </div>
  );
};


export default Listing;

