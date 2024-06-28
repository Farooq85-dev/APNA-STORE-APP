//FireStore Initialize App
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";

//FireStore Authentication CDN
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendEmailVerification,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updatePassword,
  updateEmail,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

//Cloud Firestore Database CDN
import {
  getFirestore,
  doc,
  setDoc,
  onSnapshot,
  query,
  getDocs,
  addDoc,
  getDoc,
  collection,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

//FireStore Storage CDN
import {
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

//Security FireBase
const firebaseConfig = {
  apiKey: "AIzaSyCecs2nsTFfdQN0J8pIvQuAlxPN7YBiRsg",
  authDomain: "apna-store-b0add.firebaseapp.com",
  projectId: "apna-store-b0add",
  storageBucket: "apna-store-b0add.appspot.com",
  messagingSenderId: "892210256914",
  appId: "1:892210256914:web:39b139142008b63f8e0ccb",
  measurementId: "G-04NWST42BK",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
const storage = getStorage();

//Exporting methods
export {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendEmailVerification,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut,
  storage,
  getDownloadURL,
  uploadBytes,
  uploadBytesResumable,
  ref,
  doc,
  setDoc,
  query,
  getDocs,
  db,
  addDoc,
  getDoc,
  onSnapshot,
  updateDoc,
  updatePassword,
  updateEmail,
  collection,
};
