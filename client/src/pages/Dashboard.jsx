import React from "react";
import { Outlet, useLoaderData, useNavigate } from "react-router";
import  Header  from "../components/Header.jsx";
import axios from "axios";

export const Loader = async () => {
  try {
    const { data } = await axios.get("/api/v1/user/current-user");
    return data;
  } catch (error) {
    return null;
  }
};

const Dashboard = () => {
  const navigate = useNavigate();
  const data = useLoaderData();
  const logout = async () => {
    try {
      await axios.get("/api/v1/logout");
      location.reload();
      return navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Header data={data} />
      <div>
        <Outlet context={{data,logout}} />
      </div>
    </>
  );
};

export default Dashboard;
