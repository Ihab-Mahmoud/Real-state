import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

const Header = ({ data }) => {
  const [avatar, setAvatar] = useState(data?.avatar);
  const [search, setSearch] = useState("");
  useEffect(() =>
  {
    setAvatar(data?.avatar)
  },[data]);
  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between mx-auto max-w-6xl p-3">
        <Link className="flex items-center" to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap items-center">
            <span className="text-slate-500">Real</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>
        <form className="bg-slate-100 rounded-lg  text-xs sm:text-sm flex items-center ">
          <input
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            type="text"
            placeholder="search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64 p-2"
          ></input>
          <Link
            onClick={(e) => setSearch("")}
            to={`/search?search=${search}&all=on`}
            className="p-2"
          >
            <FaSearch className="text-slate-700" />
          </Link>
        </form>
        <ul className="flex gap-3">
          <Link className=" items-center hidden sm:flex" to="/">
            <li className=" flex items-center hover:underline text-slate-700 cursor-pointer">
              Home
            </li>
          </Link>
          <Link className="items-center hidden sm:flex" to="/about">
            <li className=" items-center hover:underline text-slate-700 hidden sm:flex cursor-pointer">
              About
            </li>
          </Link>
          {avatar ? (
            <Link className="flex items-center" to="/profile">
              <img
                className=" items-center object-cover  flex cursor-pointer rounded-full w-7 h-7"
                src={avatar}
                alt="avatar"
              />
            </Link>
          ) : (
            <Link className="flex items-center" to="/login">
              <li className=" items-center hover:underline text-slate-700  flex cursor-pointer">
                Sign In
              </li>
            </Link>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Header;
