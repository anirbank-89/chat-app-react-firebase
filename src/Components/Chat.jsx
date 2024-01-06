import React, { useContext } from "react";
import { ChatContext } from "../context/ChatProvider";

// Assets
import Cam from "../Resources/images/cam.png";
import Add from "../Resources/images/add.png";
import More from "../Resources/images/more.png";

// Components
import ChatMessages from "./ChatMessages";
import Input from "./ChatInput";

function Chat() {
  const { data } = useContext(ChatContext);

  return (
    <>
      {data.chatID.length > 0 ? (
        <div className="chat">
          <div className="chatInfo">
            <span>{data?.user.displayName}</span>
            <div className="chatIcons">
              <img src={Cam} alt="" />
              <img src={Add} alt="" />
              <img src={More} alt="" />
            </div>
          </div>
          <ChatMessages chatID={data?.chatID} />
          <Input />
        </div>
      ) : (
        <div className="chat">
          <div className="chatInfo">
            <span>No Contact Selected</span>
          </div>
          <div className="messages">
            <div
              className="message sender"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <span>No Messages To Show.</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Chat;
