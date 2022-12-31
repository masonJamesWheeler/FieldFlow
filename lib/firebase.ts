// Import the functions you need from the SDKs you need
import { initializeApp} from "firebase/app";
import { getAnalytics} from "firebase/analytics";
import { getFirestore} from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyB_LUtxOFEpVd4_lTT1JCXjR4Uhpu-6hiA",
  authDomain: "playbook-89734.firebaseapp.com",
  projectId: "playbook-89734",
  storageBucket: "playbook-89734.appspot.com",
  messagingSenderId: "48420630006",
  appId: "1:48420630006:web:9beb517d8196764193abd7",
  measurementId: "G-1BLRV80GM0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
