import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCRrNsHs8cKgnvWFQVkNLHE_-qezAfXxwk",
  authDomain: "profile-ae550.firebaseapp.com",
  projectId: "profile-ae550",
  storageBucket: "profile-ae550.appspot.com",
  messagingSenderId: "873691490414",
  appId: "1:873691490414:web:9b5111bd6ecd0180755e7f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { app, db, storage, auth };
