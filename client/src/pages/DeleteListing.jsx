import axios from "axios";
import React from "react";
import { redirect } from "react-router";

export const Action = async ({ params }) => {
  const { id } = params;
  try {
    await axios.delete(`/api/v1/estate/delete-listing/${id}`);
    return redirect("/profile");
  } catch (error) {
    return null;
  }
};
