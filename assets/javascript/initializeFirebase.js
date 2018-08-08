//Initialize firebase
var config = {
    apiKey: "AIzaSyAqCpGYf4cTEVY92frXrlHvt4sCN4RrsVw",
    authDomain: "travel-app-410d0.firebaseapp.com",
    databaseURL: "https://travel-app-410d0.firebaseio.com",
    projectId: "travel-app-410d0",
    storageBucket: "travel-app-410d0.appspot.com",
    messagingSenderId: "979814528498"
};
firebase.initializeApp(config);
var database = firebase.database();