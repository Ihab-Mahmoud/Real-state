import React, { useEffect, useState } from "react";
import {
  Form,
  Link,
  redirect,
  useActionData,
  useNavigation,
} from "react-router-dom";
import axios from "axios";
import GoogleAuth from "../components/GoogleAuth";
import SubmitButton from "../components/SubmitButton";
import Title from "../components/Title";
import Input from "../components/Input";
import LoggedBefore from "../components/LoggedBefore";

export const Action = async ({ request }) => {
  try {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    await axios.post("/api/v1/register", data);
    return redirect("/");
  } catch (error) {
    return error;
  }
};

export const Loader = async () => {
  try {
    await axios.get("/api/v1/user/current-user");
    return redirect("/");
  } catch (error) {
    return null;
  }
};

const Register = () => {
  const [error, setError] = useState(false);
  const data = useActionData();
  const navigation = useNavigation();

  useEffect(() => {
    if (data?.response?.data?.msg) {
      setError(true);
    } else {
      setError(false);
    }
  }, [data]);

  return (
    <div>
      <Title text="Register" />
      <Form
        method="post"
        className="flex flex-col max-w-md sm:max-w-lg gap-4 mx-3 sm:mx-auto "
      >
        <Input type="text" name="userName" placeholder="user name" />
        <Input type="email" name="email" />
        <Input type="password" name="password" />
        <SubmitButton
          type="submit"
          color="slate"
          disabled={navigation.state == "submitting"}
          text="Register"
        />
        <GoogleAuth />
      </Form>
      <LoggedBefore
        text="Have an account?"
        type="Sign in"
        error={error}
        to="/login"
        msg={data?.response?.data?.msg}
      />
    </div>
  );
};

export default Register;
