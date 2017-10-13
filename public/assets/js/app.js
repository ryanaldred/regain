
// Initialize Firebase (All Pages)
var config = {
    apiKey: "AIzaSyAGc82642sH-oWh6m2bGjkttVdyYY-NWQU",
    authDomain: "regain-c519d.firebaseapp.com",
    databaseURL: "https://regain-c519d.firebaseio.com",
    projectId: "regain-c519d",
    storageBucket: "regain-c519d.appspot.com",
    messagingSenderId: "1094055386122"
};
firebase.initializeApp(config);
var db = firebase.firestore();


// Rounding Function
function pad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}

// Display Local Server Time
// ToDo: Change to local CLIENT time
function displaytime() {
    var dt = new Date();
    var dtHOURS = dt.getHours();
    var dtMINUTES = dt.getMinutes();
    //$('#idtime').html(dt.toLocaleTimeString());

    var dtHOURS2 = pad(dtHOURS, 2);
    var dtMINUTES2 = pad(dtMINUTES, 2);

    $('#idtime').html(dtHOURS2 + ":" + dtMINUTES2);
    //execute function every 1 second
    setTimeout("displaytime()", 1000);

    // Update sub-title with GOOD MORNING, AFTERNOON or EVENING.
    if (dtHOURS < 12){
        // Morning
        document.getElementById("subTitle").innerHTML = "Good Morning";
    } else if (dtHOURS < 18) {
        document.getElementById("subTitle").innerHTML = "Good Afternoon";
    } else {
        document.getElementById("subTitle").innerHTML = "Good Evening";
    }

}





//document.getElementById("testButton").addEventListener("click", getBackgroundImage);
document.getElementById("testButton").addEventListener("click", requestBackgroundImage);

function getBackgroundImage() {
    console.log("Executed Something 1!");

    $.get("https://us-central1-regain-c519d.cloudfunctions.net/getBackgroundImage", function (data) {
        console.log("Executed Something 2!");
        alert("Data: " + data);
        document.getElementById("backgroundImage").src = data; // Not applying this ?!?!?!?
        document.getElementById("testButton").innerHTML = "url('" + data + "')";
        document.body.style.backgroundImage = "url('" + data + "')";
        console.log("Executed Something!");
    });
}


// Request new background image.

var dateDiffMins

function requestBackgroundImage() {

    //docRef = db.doc("backgroundImage/currentImage"); <- Included for reference on alternative syntax.
    var docRef = db.collection("backgroundImage").doc("currentImage");

    // --- Update DB with current timestamp (latestRequest) ---
    docRef.update({
        // latestRequest: new Date("February 3, 2017")
        latestRequest: firebase.firestore.FieldValue.serverTimestamp() // Todo: Change to GMT
    })
        .then(function (docRef) {

            // --- Get dates - find delta in minutes ---
            console.log("Database updated");

            var docRef2 = db.collection("backgroundImage").doc("currentImage"); // Takes a document snapshot.

            docRef2.get().then(function (doc) {
                if (doc.exists) {
                    console.log("Document data:", doc.data());
                    const currentDocData = doc.data();
                    const latestRequest = currentDocData.latestRequest;
                    const lastUpdated = currentDocData.lastUpdated;
                    // Check delta.
                    var dateDiff = Math.abs(currentDocData.latestRequest - currentDocData.lastUpdated);  // Format = YYYY/MM/DD (Order: Earlier then Later Dates)
                    console.log("Difference between latest request (" + latestRequest + ") and last updated (" + lastUpdated + ")");
                    return dateDiffMins = Math.floor((dateDiff / 1000) / 60);
                } else {
                    console.log("No such document!");
                }
            }).then(function (dateDiffMins) {

                // --- Update Background Image (> 15mins) ---
                console.log("Minutes since last update: " + dateDiffMins);

                // If dataDiffMins > 15 then...
                if (dateDiffMins > 1) {
                    // Updated the Background Image in Firebase Storage
                    //console.log("Background Image URL: " + document.body.style.backgroundImage);
                    var storageRef = firebase.storage().ref();
                    var backgroundImageFile = "assets/images/slide02.jpg";
                    console.log("Background Image URL: " + currentDocData.latestRequest);

                    // Next steps...
                    // 1. Download updated image to Firebase Store (from Unsplash using URL in Document).
                    // 2. Update [lastUpdate] Firestore record with current timestamp.
                    // ...user will get updated image at next refresh cycle (when not using the 'test button')


                    // Change background image...
                    console.log("Changing background image to latest file.")
                    document.body.style.backgroundImage = "url('assets/images/slide02.jpg')";
                }
            })
                .catch(function (error) {
                    console.log("Error getting document:", error);
                })
        })
        .catch(function (error) {
            console.error("Error updating database with [latestRequest] | Error: ", error);
        })

}

function commandPrompt(evt){
    // Trap initial key press.
    console.log("Key pressed.");
    // ToDo: When pressed open command prompt if not already open.
    // If already open, just add content to command prompt.


    evt = evt || window.event;
    if (evt.keyCode == 27) { // Pressed ESCAPE key
        console.log("Pressed ESCAPE key");
        document.getElementById("commandPromptArea").style.visibility = "hidden";
        // document.getElementById("mainElements").style.visibility = "visible";
        // document.getElementById("commandPromptArea").style.display = "none";
        document.getElementById("mainElements").style.display = "block";
        document.getElementById("commandPromptInput").value="";
    } else {
        document.getElementById("commandPromptArea").style.visibility = "visible";
        // document.getElementById("mainElements").style.visibility = "hidden";
        // document.getElementById("commandPromptArea").style.display = "block";
        document.getElementById("mainElements").style.display = "none";
        document.getElementById("commandPromptInput").focus();
        document.getElementById("commandPromptInput").scrollIntoView();
    }
}



