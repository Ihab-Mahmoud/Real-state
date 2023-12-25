import React, { useEffect, useState } from "react";
import {
  Form,
  Link,
  redirect,
  useActionData,
  useLoaderData,
  useNavigation,
  useOutletContext,
} from "react-router-dom";
import SubmitButton from "../components/SubmitButton.jsx";
import Title from "../components/Title.jsx";
import Input from "../components/Input.jsx";
import axios from "axios";

export const Action = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get("avatar");
    if (file && file.size > 5000000) {
      const fileError = "oversize";
      return fileError;
    }
    await axios.patch("/api/v1/user/update", formData);
    return redirect("/");
  } catch (error) {
    return error;
  }
};

export const Loader = async () => {
  try {
    const { data } = await axios.get("/api/v1/estate/get-all-listigns");
    return data;
  } catch (error) {
    if (error?.response?.status == "401") {
      await axios.get("/api/v1/logout");
      return redirect("/");
    }
    console.log(error);
  }
  return null;
};
const Profile = () => {
  const { data, logout } = useOutletContext();
  const [img, setImg] = useState(data?.avatar);
  const [showList, setShowList] = useState(false);
  const [error,setError]=useState(false);
  const imgSizeError = useActionData();
  const navigation = useNavigation();
  const getLists = useLoaderData();

  const ActionData = useActionData();


  useEffect(() => {
    if (ActionData?.response?.data?.msg) {
      setError(true);
    } else {
      setError(false);
    }
  }, [ActionData]);

  function handleChange(e) {
    setImg(URL.createObjectURL(e.target.files[0]));
  }
  const handeDeleteUser = async () => {
    try {
      await axios.delete("api/v1/user/delete");
      logout();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-md sm:max-w-lg  mx-3 sm:mx-auto">
      <Title text="Profile" />
      <Form
        method="post"
        className="flex flex-col max-w-md sm:max-w-lg gap-4 mx-3 sm:mx-auto "
        encType="multipart/form-data"
      >
        <label htmlFor="avatar" className="flex items-center justify-center">
          <img
            className="w-24 h-24  rounded-full mb-9 cursor-pointer object-cover"
            src={img}
            alt="avatar"
          />
        </label>
        {imgSizeError == "oversize" && (
          <p className="text-red-700">Uploaded img is too large</p>
        )}
        <input
          hidden
          type="file"
          name="avatar"
          id="avatar"
          onChange={handleChange}
          accept="image/*"
        />
        <Input
          type="text"
          name="userName"
          placeholder="user name"
          defaultValue={data?.userName}
        />
        <Input type="email" name="email" defaultValue={data?.email} />
        <Input type="password" name="password" />
        <SubmitButton
          type="submit"
          color="slate"
          disabled={navigation.state == "Updating"}
          text="Update"
        />
        <Link to="/create-listing">
          <SubmitButton
            type="button"
            color="green"
            disabled={false}
            text="Create Listing"
          />
        </Link>
        {error && (
          <p className="text-red-700">{ActionData?.response?.data?.msg}</p>
        )}
      </Form>
      <div>
        <div className="flex justify-between py-5 ">
          <button className="text-red-700" onClick={handeDeleteUser}>
            Delete Account
          </button>
          <button className="text-red-700" onClick={logout}>
            Sign out
          </button>
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => setShowList(!showList)}
            className="text-green-700  text-center"
          >
            Show listing
          </button>
        </div>
      </div>
      {showList && (
        <div>
          <Title text="Your listing" />
          <div className="flex flex-col gap-5 py-3">
            {getLists?.getListings.map((listing) => {
              return (
                <div
                  key={listing.id}
                  className="flex justify-between  items-center p-3 border border-gray-300 rounded-lg"
                >
                  <Link
                    to={`/listing/${listing?.id}`}
                    className=" flex items-center justify-between gap-10"
                  >
                    <img
                      className="w-14 h-16"
                      src={listing.image}
                      alt="estate"
                    />
                    <span className="font-semibold text-sm uppercase hover:underline duration-500  ">
                      {listing.name}
                    </span>
                  </Link>
                  <div className="flex flex-col">
                    <Form
                      method="post"
                      action={`/delete-listing/${listing?.id}`}
                    >
                      <button type="submit" className="text-red-700">
                        Delete
                      </button>
                    </Form>
                    <Link
                      to={`/edit-listing/${listing?.id}`}
                      className="text-green-700"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
