import axios from "axios";
import { useContext, useEffect, useState } from "react";
import {
  Form,
  Link,
  redirect,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
  useOutletContext,
} from "react-router-dom";
import GoogleAuth from "../components/GoogleAuth";
import SubmitButton from "../components/SubmitButton.jsx";
import Title from "../components/Title.jsx";
import Input from "../components/Input.jsx";
import LoggedBefore from "../components/LoggedBefore.jsx";

export const Action = async ({ request }) => {
  try {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    await axios.post("/api/v1/login", data);
    return redirect("/");
  } catch (error) {
    return error;
  }
};

export const Loader = async () => {
  try {
    await axios.get("/api/v1/user/current-user");
    return redirect("/");
  } catch (error)
  {
    console.log(error);
    return null;
  } 
};

const Login = () => {
  const [error, setError] = useState(false);
  const navigation = useNavigation();
  const data = useActionData();
  const navigate = useNavigate();

  useEffect(() => {
    if (data?.response?.data?.msg) {
      setError(true);
    } else {
      setError(false);
    }
  }, [data]);

  return (
    <div>
      <Title text="Login" />
      <Form
        method="post"
        className="flex flex-col max-w-md sm:max-w-lg gap-4 mx-3 sm:mx-auto "
      >
        <Input type="email" name="email" />
        <Input type="password" name="password" />

        <SubmitButton
          type="submit"
          color="slate"
          disabled={navigation.state == "submitting"}
          text="login"
        />
        <GoogleAuth />
      </Form>
      <LoggedBefore
        text="Do not have an account?"
        type="Sign up"
        error={error}
        to="/register"
        msg={data?.response?.data?.msg}
      />
    </div>
  );
};

export default Login;
