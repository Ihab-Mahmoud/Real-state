import React from "react";
import { Link } from "react-router-dom";

const LoggedBefore = ({ text, type, error,to,msg }) => {
  return (
    <div className="flex flex-col max-w-md sm:max-w-lg gap-3 mx-auto mt-3">
      <p>
        {text}
        <Link to={to}>
          <span className="text-blue-400">{type}</span>
        </Link>
      </p>
      {error && <p className="text-red-700">{msg}</p>}
    </div>
  );
};

export default LoggedBefore;
