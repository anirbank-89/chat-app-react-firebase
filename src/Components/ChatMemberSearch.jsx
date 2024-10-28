import React, { useState, useContext } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { AuthContext } from "../context/AuthProvider";

// Resources
import dp from "../Resources/images/pexels-ozan-çulha-18675664.jpg";

function ChatMemberSearch() {
  const { account } = useContext(AuthContext);
  const [username, setusername] = useState("");
  const [user, setuser] = useState(null);
  const [error, seterror] = useState(false);

  const handleSearch = async (event) => {
    if (event.code === "Enter") {
      console.log(username);
      
      const usersRef = collection(db, "users");

      // Create a query against the collection.
      const q = query(usersRef, where("displayName", "==", username));

      try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          console.log(doc.data());
          // doc.data() is never undefined for query doc snapshots
          // console.log(doc.id, " => ", doc.data());
          setuser(doc.data());
        });
      } catch (error) {
        seterror(true);
      }
    }
  };

  const handleUserSelect = async (event) => {
    // check whether the group('chats' in firestore) exists, if not create new
    const combinedId =
      account.uid > user.uid ? account.uid + user.uid : user.uid + account.uid;

    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        // Create a chat in 'chats' collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        // create user chats for the logged in accound
        await updateDoc(doc(db, "userChats", account.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user?.photoURL ? user?.photoURL : dp,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        // create user chats for the pinged user
        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: account.uid,
            displayName: account.displayName,
            photoURL: account?.photoURL ? account?.photoURL : dp,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (error) {
      console.log("error", error.messages);
      seterror(true);
    }

    setuser(null);
    setusername("");
    // create user chats
  };

  return (
    <div className="chat_member_search">
      <div className="searchForm">
        <input
          type="text"
          name=""
          id=""
          placeholder="Find an user"
          onChange={(e) => setusername(e.target.value)}
          onKeyDown={handleSearch}
          value={username}
        />
      </div>
      {error && <span>User Not Found.</span>}
      {user && (
        <div className="userChat" onClick={handleUserSelect}>
          <img src={user?.photoURL ? user?.photoURL : dp} alt="" />
          <div className="userChatInfo">
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatMemberSearch;
