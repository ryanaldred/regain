const functions = require('firebase-functions');

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions



exports.getBackgroundImage = functions.https.onRequest((request, response) => {
    // response.send("Get Background Image Response");
    // console.log("Called the Get Background Image function, whoohoooo!!!");

    // Return photo from Unsplash Source (https://source.unsplash.com)
    // response.send("https://source.unsplash.com/collection/190727");
    response.header('Access-Control-Allow-Origin', '*');
    response.send("https://source.unsplash.com/collection/1230616");
    console.log("getBackgroundImage called.");


});



