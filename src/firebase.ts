import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDM06LhOJbQSl8ophFB2u94MAoeDvNWPPk",
  authDomain: "amruth-gym.firebaseapp.com",
  databaseURL: "https://amruth-gym-default-rtdb.firebaseio.com/",
  projectId: "amruth-gym",
  storageBucket: "amruth-gym.firebasestorage.app",
  messagingSenderId: "927503806647",
  appId: "1:927503806647:web:07f03f3037c70cbb601d32",
  measurementId: "G-94RZDNGDCB",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
export const auth = getAuth(app);
