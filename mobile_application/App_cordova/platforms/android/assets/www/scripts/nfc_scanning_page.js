//document.addEventListener("DOMContentLoaded", function (event) {
    
//    var nfc_code = 1;
//    // Read NDEF formatted NFC Tags
//    nfc.addNdefListener(
//        function (nfcEvent) {
//            console.log("NDEF tag accepted");
//            var tag = nfcEvent.tag,
//                ndefMessage = tag.ndefMessage;

//            // dump the raw json of the message
//            // note: real code will need to decode
//            // the payload from each record
//            alert(JSON.stringify(ndefMessage));

//            // assuming the first record in the message has
//            // a payload that can be converted to a string.
//            alert(nfc.bytesToString(ndefMessage[0].payload).substring(3));
//        },
//        function () { // success callback
//            console.log("Waiting for NDEF tag");

//            alert("Waiting for NDEF tag");

//        },
//        function (error) { // error callback
//            console.log("Error Error Error Error");

//            alert("Error adding NDEF listener " + JSON.stringify(error));
//        }
//    );
//});


var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {

        try {
            // Read NDEF formatted NFC Tags
            nfc.addTagDiscoveredListener(
                function (nfcEvent) {
                    //window.location.href = "restaurant_connection_page.html?nfc=" + "1";
                    var tag = nfcEvent.tag,
                        ndefMessage = tag.ndefMessage;

                    if (window.location.href.indexOf("nfc_scanning_page.html") > -1) {
                        window.location.href = "restaurant_connection_page.html?nfc=" + "1";
                    }

                    // dump the raw json of the message
                    // note: real code will need to decode
                    // the payload from each record
                    //alert(JSON.stringify(ndefMessage));

                    // assuming the first record in the message has 
                    // a payload that can be converted to a string.
                    //alert(nfc.bytesToString(ndefMessage[0].payload).substring(3));
                }
            );
        } catch (ex) {
            alert(ex.message);
        }


        app.receivedEvent('deviceready');

    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();