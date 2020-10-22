require("dotenv").config();

var firebaseConfig = {
  appId: process.env.REACT_APP_API_ID,
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "chat-app-ba7e4.firebaseapp.com",
  databaseURL: "https://chat-app-ba7e4.firebaseio.com",
  projectId: "chat-app-ba7e4",
  storageBucket: "chat-app-ba7e4.appspot.com",
  messagingSenderId: "997623859500"
};

export default firebaseConfig;
