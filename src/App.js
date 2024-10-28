import React, { useState } from "react";

// Components
import AuthProvider from "./context/AuthProvider";
import ChatProvider from "./context/ChatProvider";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Home from "./Pages/Home";

import "./style.scss";

const PrivateRoute = ({ authenticated, ...props }) => {
  return authenticated ? <Outlet /> : <Navigate replace to="/login" />
}

function App() {
  const [authenticated, setauthenticated] = useState(localStorage.getItem("login"));

  return (
    <AuthProvider>
      <ChatProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/register" element={<Register setauthenticated={setauthenticated} />} />
            <Route path="/login" element={<Login setauthenticated={setauthenticated} />} />

            <Route path="/" element={<PrivateRoute authenticated={authenticated} />}>
              <Route path="/" element={<Home />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;
