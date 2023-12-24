import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../fireBase.js";
import axios from "axios";
import { useNavigate } from "react-router";

const GoogleAuth = () => {
  const navigate = useNavigate();
  const handleGoogleAuth = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const user = await axios.post("/api/v1/google", {
        userName: result.user.displayName,
        email: result.user.email,
        avatar: result.user.photoURL,
      });
      navigate("/");
      return location.reload();
    } catch (error) {
      console.log(error);
    }
  };  

  return (
    <button
      onClick={handleGoogleAuth}
      type="button"
      className="bg-red-700 p-3 rounded-lg text-slate-100 uppercase hover:opacity-80 transition-all"
    >
      continue with Google
    </button>
  );
};

export default GoogleAuth;
