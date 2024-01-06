import React from "react";

// Components
import ChatSidebar from "../Components/ChatSidebar";
import Chat from "../Components/Chat";

import "../style.scss";

function Home() {
  return (
    <div className="home">
      <div className="container">
        <ChatSidebar />
        <Chat />
      </div>
    </div>
  );
}

export default Home;
