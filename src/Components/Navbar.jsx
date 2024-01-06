import React, { useContext } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthProvider";
import { ChatContext } from "../context/ChatProvider";

// Resources
import dp from "../Resources/images/pexels-ozan-çulha-18675664.jpg";

function Navbar() {
  const navigate = useNavigate();
  const { account } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
  // console.log("Logged in account", account);

  const handleLogout = () => {
    localStorage.clear(auth);
    dispatch({ type: "LOGOUT", payload: {} });
    signOut(auth);
    navigate("/login");
  };
  return (
    <div className="navbar">
      <span className="logo">Instant Chat</span>
      <div className="user">
        <img src={account?.photoURL ? account?.photoURL : dp} alt="" />
        <span>{account.displayName}</span>
        <button onClick={() => handleLogout()}>Logout</button>
      </div>
    </div>
  );
}

export default Navbar;
