import React, { useEffect, useRef, useState } from "react";
import Title from "../components/Title";
import Input from "../components/Input";
import {
  Form,
  redirect,
  useLoaderData,
  useNavigation,
} from "react-router-dom";
import SubmitButton from "../components/SubmitButton";
import CreateListCom from "../components/CreateListCom";
import NumberInput from "../components/NumberInput";
import CheckboxInput from "../components/CheckboxInput";
import axios from "axios";
import MoonLoader from "react-spinners/MoonLoader";

export const Action = async ({ request, params }) => {
  try {
    const formData = await request.formData();
    await axios.patch(`/api/v1/estate/edit-listing/${params.id}`, formData);
    return redirect("/profile");
  } catch (error) {
    return null;
  }
};

export const Loader = async ({ params }) => {
  try {
    const { data } = await axios.get(
      `/api/v1/estate/get-single-listing/${params.id}`
    );
    return data;
  } catch (error) {
    console.log(error);
  }
  return null;
};

const EditListing = () => {
  const listingData = useLoaderData();

  const [sell, setSell] = useState(listingData?.listing?.sell == "on");
  const [files, setFiles] = useState([]);
  const [offer, setOffer] = useState(listingData?.listing?.offer == "on");
  const sellRef = useRef(null);
  const rentRef = useRef(null);
  const fileRef = useRef(null);

  const navigation = useNavigation();

  const [overSizeError, SetOverSizeError] = useState(false);
  const [overLoadError, SetOverLoadError] = useState(false);

  function handleChange(e) {
    const images = [];
    [...e.target.files].forEach((file) => {
      images.push(URL.createObjectURL(file));
    });
    var overSizeCheck = 0;
    [...e.target.files].forEach((file) => {
      if (file.size > 5000000) {
        overSizeCheck++;
      }
    });
    if (e.target.files.length <= 6 && overSizeCheck == 0) {
      setFiles(images);
      SetOverSizeError(false);
      SetOverLoadError(false);
    } else {
      overSizeCheck > 0 && SetOverSizeError(true);
      e.target.files.length > 6 && SetOverLoadError(true);
      setFiles([]);
    }
  }

  const handleSellOrRent = (e) => {
    if (e.target.name == "rent") {
      setSell(false);
      if (sellRef.current.checked == false) {
        e.target.checked = true;
      }
      sellRef.current.checked = false;
    } else {
      setSell(true);
      if (rentRef.current.checked == false) {
        e.target.checked = true;
      }
      rentRef.current.checked = false;
    }
  };

  const handleOffer = (e) => {
    setOffer(!offer);
  };

  return (
    <div>
      {navigation.state == "submitting" ? (
        <div className="flex items-center justify-center gap-10 flex-col my-16">
          <MoonLoader
            color="#334155"
            loading={navigation.state == "submitting"}
            size={60}
            aria-label="Loading Spinner"
            data-testid="loader"
            speedMultiplier={0.3}
          />
          <h2 className="text-xl text-slate-700 font-semibold">
            The listing is being edited...
          </h2>
        </div>
      ) : (
        <>
          <Title text="Edit  Listing" />
          <Form
            method="post"
            encType="multipart/form-data"
            className="flex  flex-col gap-5 mx-7 sm:m-auto sm:flex-row max-w-lg sm:max-w-3xl py-5 "
          >
            <div className="flex flex-col gap-3 sm:w-2/4 ">
              <Input
                type="text"
                name="name"
                minLength={10}
                defaultValue={listingData?.listing?.name}
              />
              <textarea
                minLength={10}
                required
                className="p-3 rounded-xl focus:outline-none"
                placeholder="Description"
                name="description"
                defaultValue={listingData?.listing?.description}
              />
              <Input
                type="text"
                name="address"
                min="10"
                defaultValue={listingData?.listing?.address}
              />
              <div className="flex gap-4 mt-2">
                <CheckboxInput
                  name="sell"
                  text="Sell"
                  handleSellOrRent={handleSellOrRent}
                  refType={sellRef}
                  defaultChecked={listingData?.listing?.sell === "on" && true}
                />
                <CheckboxInput
                  name="rent"
                  text="Rent"
                  handleSellOrRent={handleSellOrRent}
                  refType={rentRef}
                  defaultChecked={listingData?.listing?.rent === "on" && true}
                />
                <CheckboxInput
                  name="parking"
                  text="Parking Spot"
                  defaultChecked={
                    listingData?.listing?.parking === "on" && true
                  }
                />
              </div>
              <div className="flex gap-4 mt-2">
                <CheckboxInput
                  name="furnished"
                  text="Furnished"
                  defaultChecked={
                    listingData?.listing?.furnished === "on" && true
                  }
                />
                <CheckboxInput
                  name="offer"
                  text="Offer"
                  handleOffer={handleOffer}
                  offer={offer}
                  defaultChecked={listingData?.listing?.offer === "on" && true}
                />
              </div>
              <div className="flex gap-4 mt-2">
                <NumberInput
                  name="beds"
                  text="Beds"
                  sell={sell}
                  defaultValue={listingData?.listing?.beds}
                />
                <NumberInput
                  name="paths"
                  text="Paths"
                  sell={sell}
                  defaultValue={listingData?.listing?.paths}
                />
              </div>
              <NumberInput
                name="price"
                text="Regular Price"
                sell={sell}
                min="50"
                defaultValue={listingData?.listing?.price}
              />
              {offer && (
                <NumberInput
                  name="discountedPrice"
                  text="Discounted Price"
                  sell={sell}
                  defaultValue={listingData?.listing?.discountedPrice}
                />
              )}
            </div>

            <div className="flex flex-col gap-6 sm:w-2/4 ">
              <label className="flex flex-col gap-4 ">
                <div>
                  Images:
                  <span className="font-light ml-1">
                    The first image will be the cover (max 6)
                  </span>
                </div>
                {overSizeError && (
                  <p className="py-2 text-xs  text-red-700">
                    Each photo must be Less than 5 mg
                  </p>
                )}
                {overLoadError && (
                  <p className="py-2 text-xs  text-red-700">
                    max 6 photos are allowed
                  </p>
                )}
                <div className="flex justify-between items-center gap-3 ">
                  <input
                    ref={fileRef}
                    onChange={handleChange}
                    type="file"
                    accept="image/*"
                    name="listingImgs"
                    multiple
                  />
                </div>
              </label>
              <div className="flex flex-col  gap-5 justify-between items-center">
                {files.map((file, index) => {
                  return (
                    <CreateListCom key={index} index={index} file={file} />
                  );
                })}
              </div>
              <SubmitButton
                type={overSizeError || overLoadError ? "button" : "submit"}
                text="Edit"
                disabled={navigation.state == "submitting"}
              />
            </div>
          </Form>
        </>
      )}
    </div>
  );
};
export default EditListing;
