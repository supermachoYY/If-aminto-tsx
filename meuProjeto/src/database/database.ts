import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAkqngJXbPwVzgAtBFejFU2BCaVF2a7ZAQ",
  authDomain: "if-aminto-e95c1.firebaseapp.com",
  projectId: "if-aminto-e95c1",
  storageBucket: "if-aminto-e95c1.appspot.app", // ✅ CORRETO
  messagingSenderId: "987274612503",
  appId: "1:987274612503:web:3af69dcd9e783d7bddf152"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };