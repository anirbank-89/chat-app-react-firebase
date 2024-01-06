import React, { useContext, useState, useRef } from "react";
import { AuthContext } from "../context/AuthProvider";
import { ChatContext } from "../context/ChatProvider";
import {
  Timestamp,
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../config/firebaseConfig";
import { v4 as uuidv4 } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

// Assets
import img from "../Resources/images/img.png";
import attachIcon from "../Resources/images/attach.png";

function ChatInput() {
  const { account } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const [text, settext] = useState("");
  const [image, setimage] = useState(null);
  const imgRef = useRef();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (image) {
      const storageRef = ref(storage, uuidv4());
      const file = image;

      const uploadTask = uploadBytesResumable(storageRef, file);

      // Register three observers:
      // 1. 'state_changed' observer, called any time the state changes
      // 2. Error observer, called on failure
      // 3. Completion observer, called on successful completion

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              console.log("Upload is in unknown state");
              break;
          }
        },
        (error) => {
          var errorMessage = error.message;
          console.log("Photo upload error", errorMessage);
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref)
            .then(async (downloadUrl) => {
              await updateDoc(doc(db, "chats", data.chatID), {
                messages: arrayUnion({
                  id: uuidv4(),
                  text,
                  senderId: account.uid,
                  date: Timestamp.now(),
                  img: downloadUrl,
                }),
              });
            })
            .catch((error) => {
              var errorMessage = error.message;
              console.log("Registration", errorMessage);
            });
        }
      );
    } else {
      await updateDoc(doc(db, "chats", data.chatID), {
        messages: arrayUnion({
          id: uuidv4(),
          text,
          senderId: account.uid,
          date: Timestamp.now(),
        }),
      });
    }

    // update the user chat of logged in user
    await updateDoc(doc(db, "userChats", account.uid), {
      [data.chatID + ".lastMessage"]: { text },
      [data.chatID + ".date"]: serverTimestamp(),
    });

    // update the user chat of pinged user
    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatID + ".lastMessage"]: { text },
      [data.chatID + ".date"]: serverTimestamp(),
    });

    settext("");
    setimage(null);
    imgRef.current.value = null;
  };

  return (
    <div className="chat_input">
      <input
        type="text"
        name=""
        id=""
        placeholder="Type something..."
        value={text}
        onChange={(e) => settext(e.target.value)}
      />
      <div className="send">
        <img src={attachIcon} alt="" />
        <input
          ref={imgRef}
          type="file"
          name=""
          id="attachment"
          style={{ display: "none" }}
          onChange={(e) => setimage(e.target.files[0])}
        />
        <label htmlFor="attachment">
          <img src={img} alt="" />
        </label>
        <button onClick={handleSubmit}>Send</button>
      </div>
    </div>
  );
}

export default ChatInput;
