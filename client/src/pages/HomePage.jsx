import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLoaderData, useNavigation, useOutlet, useOutletContext } from "react-router";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import ListingCard from "../components/ListingCard";
import BeatLoader from "react-spinners/BeatLoader";

export const Loader = async ({ params }) => {
  try {
    const { data } = await axios.get(`/api/v1/estate/get-latest-proposals`);
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const HomePage = () => {
  SwiperCore.use([Navigation]);
  const listings = useLoaderData();

 const navigation = useNavigation();

 const isLoading = navigation.state === "loading";

  const images = [
    "https://res.cloudinary.com/ddvpnidzz/image/upload/v1703442931/brian-babb-XbwHrt87mQ0-unsplash_ivgvw9.jpg",
    "https://res.cloudinary.com/ddvpnidzz/image/upload/v1703442935/francesca-tosolini-XcVm8mn7NUM-unsplash_ixuo3c.jpg",
    "https://res.cloudinary.com/ddvpnidzz/image/upload/v1703442930/etienne-beauregard-riverin-B0aCvAVSX8E-unsplash_ge0i3s.jpg",
  ];
  return (
    <div>
      <div className="my-28 max-w-6xl px-3  mx-auto ">
        <h1 className="text-3xl font-bold text-slate-700 md:text-5xl">
          Find your next <span className="text-gray-400">perfect</span>
          <br />
          place with ease
        </h1>
        <p className="py-5 text-slate-400 text-sm  ">
          Sahand Estate will help you find your home fast, easy and comfortable.
          <br />
          Our expert support are always available.
        </p>
        <Link
          to={`/search`}
          className="text-violet-900 hover:underline duration-300"
        >
          Let's Start now...
        </Link>
      </div>
      <Swiper navigation>
        {images.map((image) => {
          return (
            <SwiperSlide key={image}>
              <div
                className="h-[500px]"
                style={{
                  background: `url(${image}) center no-repeat`,
                  backgroundSize: `cover`,
                }}
              ></div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {isLoading ? (
        <BeatLoader
          color="#334155"
          loading={isLoading}
          size={15}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      ) : (
        <>
          <div className="my-10 max-w-6xl px-3  mx-auto ">
            <div>
              <h2 className="text-slate-600 text-2xl font-semibold">
                Recent offers
              </h2>
              <Link
                to={`/search?offer=on&all=on`}
                className="text-sky-600 hover:underline duration-300"
              >
                Show more offers
              </Link>
              <div className="py-4 flex flex-wrap gap-5 justify-center sm:justify-start">
                {listings?.allOffers.map((offer) => {
                  return (
                    <ListingCard
                      key={offer._id}
                      id={offer._id}
                      rent={offer.rent}
                      beds={offer.beds}
                      baths={offer.baths}
                      price={offer.price}
                      description={offer.description}
                      name={offer.name}
                      address={offer.address}
                      image={offer.images[0]}
                    />
                  );
                })}
              </div>
            </div>
          </div>
          <div className="my-10 max-w-6xl px-3  mx-auto ">
            <div>
              <h2 className="text-slate-600 text-2xl font-semibold">
                Recent places for sell
              </h2>
              <Link
                to={`/search?sell=on`}
                className="text-sky-600 hover:underline duration-300"
              >
                Show more offers
              </Link>
              <div className="py-4 flex flex-wrap gap-5 justify-center sm:justify-start">
                {listings?.allSells.map((offer) => {
                  return (
                    <ListingCard
                      id={offer._id}
                      key={offer._id}
                      rent={offer.rent}
                      beds={offer.beds}
                      baths={offer.baths}
                      price={offer.price}
                      description={offer.description}
                      name={offer.name}
                      address={offer.address}
                      image={offer.images[0]}
                    />
                  );
                })}
              </div>
            </div>
          </div>
          <div className="my-10 max-w-6xl px-3  mx-auto ">
            <div>
              <h2 className="text-slate-600 text-2xl font-semibold">
                Recent places for rent
              </h2>
              <Link
                to={`/search?rent=on`}
                className="text-sky-600 hover:underline duration-300"
              >
                Show more offers
              </Link>
              <div className="py-4 flex flex-wrap gap-5 justify-center sm:justify-start">
                {listings?.allRents.map((offer) => {
                  return (
                    <ListingCard
                      id={offer._id}
                      key={offer._id}
                      rent={offer.rent}
                      beds={offer.beds}
                      baths={offer.baths}
                      price={offer.price}
                      description={offer.description}
                      name={offer.name}
                      address={offer.address}
                      image={offer.images[0]}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
