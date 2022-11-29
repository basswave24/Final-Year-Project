import { initializeApp } from "firebase/app";

import { getDatabase } from "firebase/database";


const firebase = {

    apiKey: "AIzaSyD1stPkXOjzn7ReMAIs1egI76QOFYGnwXE",

    authDomain: "life-enhance-by-dan.firebaseapp.com",

    projectId: "life-enhance-by-dan",

    storageBucket: "life-enhance-by-dan.appspot.com",

    messagingSenderId: "559677404636",

    appId: "1:559677404636:web:6103657a65af295da74b19",

    measurementId: "G-R1ZM31C3YB",

    databaseURL: "https://life-enhance-by-dan-default-rtdb.europe-west1.firebasedatabase.app/"


};

export const app = initializeApp(firebase);

export const database = getDatabase(app);