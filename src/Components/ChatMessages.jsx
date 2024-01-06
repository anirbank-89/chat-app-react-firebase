import React, { useState, useEffect } from "react";
// import { ChatContext } from "../context/ChatProvider";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

// Components
import Message from "./Message";

function ChatMessages({ chatID }) {
  const [messages, setmessages] = useState([]);
  // const { data } = useContext(ChatContext);
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "chats", chatID), (doc) => {
      //  console.log("Chat messages: ", doc.data());
      doc.exists() && setmessages(doc.data().messages);
    });

    return () => {
      unsub();
    };
  }, [chatID]);

  return (
    <div className="messages">
      {messages.map((m, idx) => (
        <Message key={idx} message={m} />
      ))}

      {/* <Message />
      <Message />
      <Message />
      <Message />
      <Message />
      <Message />
      <Message />
      <Message />
      <Message /> */}
    </div>
  );
}

export default ChatMessages;
