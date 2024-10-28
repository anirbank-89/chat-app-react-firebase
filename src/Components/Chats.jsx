import React, { useState, useEffect, useContext } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { AuthContext } from "../context/AuthProvider";
import { ChatContext } from "../context/ChatProvider";

import dp from "../Resources/images/pexels-ozan-çulha-18675664.jpg";

const Chats = () => {
  const { account } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
  const [chats, setchats] = useState([]);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", account.uid), (doc) => {
        // console.log("Current data: ", doc.data());
        setchats(Object.entries(doc.data())); // the data structure of chats = [[uid, { date: "2024-01-05T12:36:00Z", userInfo: {photoURL, uid, displayName}}],...]
      });

      return () => {
        unsub();
      };
    };

    account.uid && getChats();
  }, [account?.uid]);

  // console.log(chats);

  const handleSelect = (user) => {
    dispatch({ type: "CHANGE_USER", payload: user });
  };

  return (
    <div className="chats">
      {chats
        ?.sort((a, b) => b[1].date - a[1].date)
        .map(
          (
            chat // the data structure of chats = [[uid, { date: "2024-01-05T12:36:00Z", userInfo: {photoURL, uid, displayName}}],...]
          ) => (
            <div
              className="userChat"
              key={chat[0]}
              onClick={() => handleSelect(chat[1]?.userInfo)}
            >
              <img
                src={
                  chat[1]?.userInfo?.photoURL ? chat[1]?.userInfo?.photoURL : dp
                }
                alt=""
              />
              <div className="userChatInfo">
                <span>{chat[1]?.userInfo?.displayName}</span>
                <p>{chat[1]?.lastMessage?.text}</p>
              </div>
            </div>
          )
        )}
    </div>
  );
};

export default Chats;
