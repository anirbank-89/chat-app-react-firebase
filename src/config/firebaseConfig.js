// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

/** ---- Your web app's Firebase configuration ---- */
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyBfw5Z3v1nrnLbR0XTXUvQ-66JdG0TKWoY",
//   authDomain: "test-chat-app-2-b704c.firebaseapp.com",
//   projectId: "test-chat-app-2-b704c",
//   storageBucket: "test-chat-app-2-b704c.appspot.com",
//   messagingSenderId: "825028764720",
//   appId: "1:825028764720:web:113030198e50a626ffb9f5",
//   measurementId: "G-EH4TYH76DW"
// };
const firebaseConfig = {
  apiKey: "AIzaSyBfKdqSP4TN5Uud5b0JGpJbPyDz-NkUIkQ",
  authDomain: "test-chat-app-1-7e098.firebaseapp.com",
  projectId: "test-chat-app-1-7e098",
  storageBucket: "test-chat-app-1-7e098.appspot.com",
  messagingSenderId: "272595374070",
  appId: "1:272595374070:web:97560c00033f58ab5e41d7"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth();
// Create a root reference
export const storage = getStorage();
export const db = getFirestore();


