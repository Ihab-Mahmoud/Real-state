import React, { useEffect, useRef, useState } from "react";
import Title from "../components/Title";
import Input from "../components/Input";
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import SubmitButton from "../components/SubmitButton";
import CreateListCom from "../components/CreateListCom";
import NumberInput from "../components/NumberInput";
import CheckboxInput from "../components/CheckboxInput";
import axios from "axios";
import MoonLoader from "react-spinners/MoonLoader";

export const Action = async ({ request }) => {
  try {
    const formData = await request.formData();
    await axios.post("/api/v1/estate/create-listing", formData);
    return redirect("/profile");
  } catch (error) {
    return null;
  }
};

const CreateListing = () => {
  const [files, setFiles] = useState([]);
  const [sell, setSell] = useState(true);
  const [offer, setOffer] = useState(false);
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
    let overSizeCheck = false;
    [...e.target.files].forEach((file) => {
      if (file.size > 5000000) {
        overSizeCheck=true;
      }
    });
    if (e.target.files.length <= 6 && !overSizeCheck) {
      setFiles(images);
      SetOverSizeError(false);
      SetOverLoadError(false);
    } else {
      overSizeCheck  && SetOverSizeError(true);
      e.target.files.length > 6 && SetOverLoadError(true);
      setFiles([]);
    }
  }

  const handleSellOrRent = (e) => {
    if (e.target.name == "rent") {
      setSell(false);
      if (!sellRef.current.checked) {
        e.target.checked = true;
      }
      sellRef.current.checked = false;
    } else {
      setSell(true);
      if (!rentRef.current.checked) {
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
            A new listing is being created...
          </h2>
        </div>
      ) : (
        <>
          <Title text="Create a Listing" />
          <Form
            method="post"
            encType="multipart/form-data"
            className="flex  flex-col gap-5 mx-7 sm:m-auto sm:flex-row max-w-lg sm:max-w-3xl py-5 "
          >
            <div className="flex flex-col gap-3 sm:w-2/4 ">
              <Input type="text" name="name" minLength={10} />
              <textarea
                minLength={10}
                required
                className="p-3 rounded-xl focus:outline-none"
                placeholder="Description"
                name="description"
              />
              <Input type="text" name="address" min="10" />
              <div className="flex gap-4 mt-2">
                <CheckboxInput
                  name="sell"
                  text="Sell"
                  handleSellOrRent={handleSellOrRent}
                  refType={sellRef}
                  defaultChecked={true}
                />
                <CheckboxInput
                  name="rent"
                  text="Rent"
                  handleSellOrRent={handleSellOrRent}
                  refType={rentRef}
                />
                <CheckboxInput name="parking" text="Parking Spot" />
              </div>
              <div className="flex gap-4 mt-2">
                <CheckboxInput name="furnished" text="Furnished" />
                <CheckboxInput
                  name="offer"
                  text="Offer"
                  handleOffer={handleOffer}
                  offer={offer}
                />
              </div>
              <div className="flex gap-4 mt-2">
                <NumberInput
                  name="beds"
                  text="Beds"
                  sell={sell}
                  defaultValue={1}
                />
                <NumberInput
                  name="baths"
                  text="baths"
                  sell={sell}
                  defaultValue={1}
                />
              </div>
              <NumberInput
                name="price"
                text="Regular Price"
                sell={sell}
                defaultValue={0}
                min="50"
              />
              {offer && (
                <NumberInput
                  name="discountedPrice"
                  text="Discounted Price"
                  sell={sell}
                  defaultValue={0}
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
                {overSizeError &&(
                  <p className="py-2 text-xs  text-red-700">
                    Each photo must be Less than 5 mg
                  </p>
                )}
                {overLoadError &&(
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
                    required
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
                text="Create"
                disabled={navigation.state == "submitting"}
                type={overSizeError || overLoadError ? "button" : "submit"}
              />
            </div>
          </Form>
        </>
      )}
    </div>
  );
};
export default CreateListing;
