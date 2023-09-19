// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAvVK5BPZN2UteYKkVLcz34FiSJEUFOJuA",
  authDomain: "project-manager-585ed.firebaseapp.com",
  projectId: "project-manager-585ed",
  storageBucket: "project-manager-585ed.appspot.com",
  messagingSenderId: "285995341568",
  appId: "1:285995341568:web:ed7d7117fb8a85d83645e5",
  measurementId: "G-VX9L1GZRWL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const imageDb = getStorage(app);
