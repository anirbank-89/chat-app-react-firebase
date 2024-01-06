import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { Link, useNavigate } from "react-router-dom";

const initialValues = {
  email: "",
  password: "",
};

function Login({ setauthenticated }) {
  const navigate = useNavigate();
  const [loginInfo, setloginInfo] = useState(initialValues);
  const [loginError, setloginError] = useState("");

  const handleChange = (event) => {
    setloginInfo({ ...loginInfo, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await signInWithEmailAndPassword(auth, loginInfo.email, loginInfo.password)
      .then(async (userCredential) => {
        setloginError("");
        // Signed in
        const user = userCredential.user;
        console.log(user);

        localStorage.setItem("accessToken", user.accessToken);
        localStorage.setItem("refreshToken", user.refreshToken);
        localStorage.setItem("login", true);

        setauthenticated(true);

        navigate("/");
      })
      .catch((error) => {
        if (error) {
          // var errorCode = error.code;
          var errorMessage = error.message;
          console.log("Sign in error", errorMessage);
          setloginError("Something Went Wrong. Please Try Again.");
        }
      });
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Instant Chat</span>
        <span className="title">Sign In</span>
        <form>
          <input
            type="email"
            name="email"
            id="email"
            value={loginInfo.email}
            placeholder="Email"
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            id="password"
            value={loginInfo.password}
            placeholder="Password"
            onChange={handleChange}
          />
          <input type="file" name="" id="file" style={{ display: "none" }} />
          <button onClick={handleSubmit}>Sign In</button>
          {loginError.length > 0 && (
            <span style={{ color: "#820E13" }}>{loginError}</span>
          )}
          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
