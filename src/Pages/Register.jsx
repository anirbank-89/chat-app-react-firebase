import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, storage, db } from "../config/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

import addAvatar from "../Resources/images/addAvatar.png";

const initialValues = {
  displayName: "",
  email: "",
  password: "",
  photoURL: "",
};

const createErrors = {
  image_upload_error: "",
  registration_error: "",
};

function Register({ setauthenticated }) {
  const navigate = useNavigate();
  const [registrationInfo, setregistrationInfo] = useState(initialValues);
  const [registrationError, setregistrationError] = useState(createErrors);

  function handleChange(event) {
    if (event.target.name === "photoURL") {
      setregistrationInfo((prev) => {
        let update = JSON.parse(JSON.stringify(prev));
        update.photoURL = event.target.files[0];

        return update;
      });
    } else {
      setregistrationInfo({
        ...registrationInfo,
        [event.target.name]: event.target.value,
      });
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    await createUserWithEmailAndPassword(
      auth,
      registrationInfo.email,
      registrationInfo.password
    )
      .then(async (userCredential) => {
        setregistrationError(createErrors);
        // Signed up
        const user = userCredential.user;
        console.log(user);

        await updateProfile(user, {
          displayName: registrationInfo.displayName,
        });

        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          displayName: registrationInfo.displayName,
          email: user.email,
        });

        const storageRef = ref(
          storage,
          registrationInfo.displayName.split(" ").join("_").toLocaleUpperCase()
        );
        const file = registrationInfo.photoURL;
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
            // var errorCode = error.code;
            var errorMessage = error.message;
            console.log("Photo upload error", errorMessage);
            setregistrationError({
              ...createErrors,
              image_upload_error: "Failed to upload Image. Please try again.",
            });
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                console.log("File available at", downloadURL);
                await updateProfile(user, {
                  displayName: registrationInfo.displayName,
                  photoURL: downloadURL,
                });

                await setDoc(doc(db, "users", user.uid), {
                  uid: user.uid,
                  displayName: registrationInfo.displayName,
                  email: user.email,
                  photoURL: downloadURL,
                });

                await setDoc(doc(db, "userChats", user.uid), {});

                localStorage.setItem("accessToken", user.accessToken);
                localStorage.setItem("refreshToken", user.refreshToken);
                localStorage.setItem("login", true);

                setauthenticated(true);

                navigate("/");
              }
            );
          }
        );
      })
      .catch((error) => {
        if (error) {
          // var errorCode = error.code;
          var errorMessage = error.message;
          console.log("Registration", errorMessage);
          setregistrationError({
            ...createErrors,
            registration_error:
              "Something Went Wrong. Please Try With Another Email.",
          });
        }
      });
  }

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Instant Chat</span>
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="displayName"
            placeholder="Display Name"
            value={registrationInfo.displayName}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={registrationInfo.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            value={registrationInfo.password}
            placeholder="Password"
            onChange={handleChange}
          />
          <input
            type="file"
            name="photoURL"
            id="file"
            style={{ display: "none" }}
            onChange={handleChange}
          />
          <label htmlFor="file">
            <img src={addAvatar} alt="" />
            <span>Add An Avatar</span>
          </label>
          <button>Sign Up</button>
          {registrationError.image_upload_error.length > 0 && (
            <span style={{ color: "#820E13" }}>
              {registrationError.image_upload_error}
            </span>
          )}
          {registrationError.registration_error.length > 0 && (
            <span style={{ color: "#820E13" }}>
              {registrationError.registration_error}
            </span>
          )}
        </form>
        <p>
          Have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
