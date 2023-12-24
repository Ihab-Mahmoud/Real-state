import React, { useEffect, useState } from "react";
import SubmitButton from "./SubmitButton";
import { Link } from "react-router-dom";
import axios from "axios";

const ContactLord = ({ listing }) => {
  const [message, setMessage] = useState("");
  const [landLord, setLandLord] = useState("");
  useEffect(() =>
  {
    const fetchLandLord =async () =>
    {
      try {
          const {data:{user}}  = await axios.get(
            `/api/v1/user/get-owner/${listing?.createdBy}`
          );
          setLandLord(user);
        }
      catch (error) {
        console.log(error);
      }
    }
    fetchLandLord();
  }, [listing?.createdBy]);
  return (
    <div className="flex flex-col gap-2">
      <p>
        Contact <span className="font-semibold"> {landLord?.userName}</span> for{" "}
        <span className="font-semibold">{listing?.name}</span>
      </p>
      <textarea
        className="w-full p-3 rounded-xl focus:outline-none h-24 "
        type="text"
        name="message"
        value={message}
        minLength={10}
        required
        placeholder="Enter your message here..."
        onChange={(e) => setMessage(e.target.value)}
      />
      <Link
        to={`mailto:${landLord?.email}?subject=Regarding ${
          listing?.name
        }&body=${message}`}
      >
        <SubmitButton text="Send message" type="button" color="slate" />
      </Link>
    </div>
  );
};

export default ContactLord;
