import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthProvider";
import { ChatContext } from "../context/ChatProvider";

// Assets
import dp from "../Resources/images/pexels-ozan-çulha-18675664.jpg";

function Message({ message }) {
  // console.log("message", message);
  const { account } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const latestMsg = useRef();

  useEffect(() => {
    latestMsg.current.scrollIntoView({ behaviour: "smooth" });
  }, [message]);

  return (
    <div
      ref={latestMsg}
      className={`message ${
        message.senderId === account.uid ? "sender" : "owner"
      }`}
    >
      <div className="messageInfo">
        <img
          src={
            message.senderId === account.uid
              ? account?.photoURL
                ? account?.photoURL
                : dp
              : data?.user?.photoURL
              ? data?.user?.photoURL
              : dp
          }
          alt=""
        />
        <span>Just Now</span>
      </div>
      <div className="messageContent">
        <p>{message?.text}</p>
        {message?.img && <img src={message?.img} alt="" />}
      </div>
    </div>
  );
}

export default Message;
