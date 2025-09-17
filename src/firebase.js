import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCU7NSTkghjAUBj5jp0bkTO9q3tqa6ZeDo",
    authDomain: "digital-financial-literacy.firebaseapp.com",
    projectId: "digital-financial-literacy",
    storageBucket: "digital-financial-literacy.firebasestorage.app",
    messagingSenderId: "790138990258",
    appId: "1:790138990258:web:8947e836c0bf626e5263ab",
    measurementId: "G-61DYSGSXF2"

};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
