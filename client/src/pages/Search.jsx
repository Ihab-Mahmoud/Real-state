import React, { useRef } from "react";
import CheckboxInput from "../components/CheckboxInput";
import SubmitButton from "../components/SubmitButton";
import ListingCard from "../components/ListingCard";
import { useLoaderData, useNavigate, useNavigation } from "react-router";
import BeatLoader from "react-spinners/BeatLoader";
import axios from "axios";

const LISTING_SORT_BY = {
  NEWEST_FIRST: "newest",
  OLDEST_FIRST: "oldest",
  ASCENDING: "price high to low",
  DESCENDING: "price low to high",
};

export const Loader = async ({ request }) => {
  const params = Object.fromEntries([
    ...new URL(request.url).searchParams.entries(),
  ]);
  try {
    const { data } = await axios.get("/api/v1/estate/get-all-proposals", {
      params,
    });
    return { params, data };
  } catch (error) {
    console.log(error);
    return null;
  }
};

const Search = () => {
  const sellRef = useRef(null);
  const rentRef = useRef(null);
  const sellRentRef = useRef(null);

  const { params, data } = useLoaderData();
  const navigate = useNavigate();

  const navigation = useNavigation();

  const isLoading = navigation.state === "loading";
  const handleSellOrRent = (e) => {
    if (e.target.name == "rent") {
      if (!sellRef.current.checked && !sellRentRef.current.checked) {
        e.target.checked = true;
      }
      sellRef.current.checked = false;
      sellRentRef.current.checked = false;
    } else if (e.target.name == "sell") {
      if (!rentRef.current.checked && !sellRentRef.current.checked) {
        e.target.checked = true;
      }
      rentRef.current.checked = false;
      sellRentRef.current.checked = false;
    } else {
      if (!rentRef.current.checked && !sellRef.current.checked) {
        e.target.checked = true;
      }
      console.log(sellRef.current.checked);
      rentRef.current.checked = false;
      sellRef.current.checked = false;
    }
  };

  const handleShowMore = (limit) => {
    console.log(limit);
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("limit", limit);
    navigate(`${location.pathname}?${searchParams}`);
  };

  return (
    <div className="flex w-[96%] m-auto my-8 flex-col sm:flex-row gap-4 ">
      <form className="flex flex-col gap-8 sm:basis-1/4 ">
        <div className="flex gap-2 items-center sm:gap-4">
          <span>Search Term:</span>
          <input
            className="rounded-lg p-2 focus:outline-none"
            type="text"
            name="search"
            placeholder="search..."
            defaultValue={params?.search}
          />
        </div>
        <div className="flex gap-3 items-center sm:gap-4 ">
          <span>Type:</span>
          <div className="flex gap-3 sm:gap-5">
            <CheckboxInput
              name="all"
              text="Rent & Sell"
              handleSellOrRent={handleSellOrRent}
              refType={sellRentRef}
              defaultChecked={
                Object.values(params).length == 0
                  ? true
                  : params?.all == "on" && true
              }
            />
            <CheckboxInput
              name="sell"
              text="Sell"
              handleSellOrRent={handleSellOrRent}
              refType={sellRef}
              defaultChecked={params?.sell == "on" && true}
            />
            <CheckboxInput
              name="rent"
              text="Rent"
              handleSellOrRent={handleSellOrRent}
              refType={rentRef}
              defaultChecked={params?.rent == "on" && true}
            />
            <CheckboxInput
              name="offer"
              text="Offer"
              defaultChecked={params?.offer == "on" && true}
            />
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <span>Amenities:</span>
          <div className="flex gap-3">
            <CheckboxInput
              name="parking"
              text="Parking Spot"
              defaultChecked={params?.parking == "on" && true}
            />
            <CheckboxInput
              name="furnished"
              text="Furnished"
              defaultChecked={params?.furnished == "on" && true}
            />
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <span>Sort:</span>
          <select
            className="rounded-lg p-2 focus:outline-none"
            name="sort"
            defaultValue={params?.sort}
          >
            {Object.values(LISTING_SORT_BY).map((sort) => {
              return (
                <option key={sort} value={sort}>
                  {sort}
                </option>
              );
            })}
          </select>
        </div>
        <SubmitButton text="Search" type="submit" />
      </form>
      {isLoading ? (
        <div className="flex  justify-center px-5 border-s-2 mt-15 ">
          <BeatLoader
            color="#334155"
            loading={isLoading}
            size={15}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        <div className="flex flex-col justify-start ps-5 border-s-2  sm:basis-3/4 ">
          <h1 className="  text-2xl font-semibold text-slate-700 pb-8 sm:text-3xl">
            Listing restult :
          </h1>
          <div className="flex flex-wrap gap-5">
            {data?.proposals.map((proposal) => {
              return (
                <ListingCard
                  key={proposal._id}
                  baths={proposal.baths}
                  price={
                    proposal.discountedprice
                      ? proposal.discountedprice
                      : proposal.price
                  }
                  id={proposal._id}
                  name={proposal.name}
                  description={proposal.description}
                  image={proposal.images[0]}
                  address={proposal.address}
                  beds={proposal.beds}
                  type={proposal.type}
                />
              );
            })}
          </div>
          <div className="flex justify-between">
            {data?.totalProposals > 12 && (
              <span
                onClick={() => {
                  if (data?.totalProposals > data?.limit) {
                    let limit = Number(data?.limit) + 12;
                    handleShowMore(limit);
                  }
                }}
                className="pt-5 text-cyan-800 block cursor-pointer"
              >
                Show more..
              </span>
            )}
            <span className="pt-5 text-cyan-800 block ">
              Total Proposals :{data?.totalProposals}
            </span>
            {data?.totalProposals > 12 && (
              <span
                onClick={() => {
                  if (Number(data?.limit) > 12) {
                    let limit = Number(data?.limit) - 12;
                    handleShowMore(limit);
                  }
                }}
                className="pt-5 text-cyan-800 block cursor-pointer"
              >
                Show less..
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
