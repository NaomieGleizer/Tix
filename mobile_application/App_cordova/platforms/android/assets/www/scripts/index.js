//////// For an introduction to the Blank template, see the following documentation:
//////// http://go.microsoft.com/fwlink/?LinkID=397704
//////// To debug code on page load in cordova-simulate or on Android devices/emulators: launch your app, set breakpoints, 
//////// and then run "window.location.reload()" in the JavaScript Console.
//////(function () {
//////    "use strict";

//////    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

//////    function onDeviceReady() {
//////        //navigator.splashscreen.show();
//////        // Handle the Cordova pause and resume events
//////        //document.addEventListener( 'pause', onPause.bind( this ), false );
//////        //document.addEventListener( 'resume', onResume.bind( this ), false );
        
//////        //// TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
//////        //var parentElement = document.getElementById('deviceready');
//////        //var listeningElement = parentElement.querySelector('.listening');
//////        //var receivedElement = parentElement.querySelector('.received');
//////        //listeningElement.setAttribute('style', 'display:none;');
//////        //receivedElement.setAttribute('style', 'display:block;');

//////        //app.receivedEvent('deviceready');

//////        // Read NDEF formatted NFC Tags
//////        nfc.addTagDiscoveredListener(
//////            function (nfcEvent) {
//////                var tag = nfcEvent.tag,
//////                    ndefMessage = tag.ndefMessage;
//////                console.log(JSON.stringify(ndefMessage));
//////                // dump the raw json of the message
//////                // note: real code will need to decode
//////                // the payload from each record
//////                alert(JSON.stringify(ndefMessage));

//////                // assuming the first record in the message has
//////                // a payload that can be converted to a string.
//////                alert(nfc.bytesToString(ndefMessage[0].payload).substring(3));
//////            },
//////            function () { // success callback
//////                alert("Waiting for NDEF tag");
//////            },
//////            function (error) { // error callback
//////                alert("Error adding NDEF listener " + JSON.stringify(error));
//////            }
//////        );
//////        app.receivedEvent('deviceready');
//////    };

//////    function onPause() {
//////        // TODO: This application has been suspended. Save application state here.
//////    };

//////    function onResume() {
//////        // TODO: This application has been reactivated. Restore application state here.
//////    };
//////} )();

/////*
//// * Licensed to the Apache Software Foundation (ASF) under one
//// * or more contributor license agreements.  See the NOTICE file
//// * distributed with this work for additional information
//// * regarding copyright ownership.  The ASF licenses this file
//// * to you under the Apache License, Version 2.0 (the
//// * "License"); you may not use this file except in compliance
//// * with the License.  You may obtain a copy of the License at
//// *
//// * http://www.apache.org/licenses/LICENSE-2.0
//// *
//// * Unless required by applicable law or agreed to in writing,
//// * software distributed under the License is distributed on an
//// * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
//// * KIND, either express or implied.  See the License for the
//// * specific language governing permissions and limitations
//// * under the License.
//// */
////var app = {
////    // Application Constructor
////    initialize: function() {
////        this.bindEvents();
////    },
////    // Bind Event Listeners
////    //
////    // Bind any events that are required on startup. Common events are:
////    // 'load', 'deviceready', 'offline', and 'online'.
////    bindEvents: function() {
////        document.addEventListener('deviceready', this.onDeviceReady, false);
////    },
////    // deviceready Event Handler
////    //
////    // The scope of 'this' is the event. In order to call the 'receivedEvent'
////    // function, we must explicitly call 'app.receivedEvent(...);'
////    onDeviceReady: function () {

////        try {
////            // Read NDEF formatted NFC Tags
////            nfc.addNdefListener(
////                function (nfcEvent) {
////                    "use strict";
////                    var tag = nfcEvent.tag,
////                        ndefMessage = tag.ndefMessage;

////                    // dump the raw json of the message
////                    // note: real code will need to decode
////                    // the payload from each record
////                    alert(JSON.stringify(ndefMessage));

////                    // assuming the first record in the message has 
////                    // a payload that can be converted to a string.
////                    alert(nfc.bytesToString(ndefMessage[0].payload).substring(3));
////                },
////                function () { // success callback
////                    alert("Waiting for NDEF tag");
////                },
////                function (error) { // error callback
////                    alert("Error adding NDEF listener " + JSON.stringify(error));
////                }
////            );
////        } catch (ex) {
////            alert(ex.message);
////        }


////        app.receivedEvent('deviceready');

////    },
////    // Update DOM on a Received Event
////    receivedEvent: function(id) {
////        var parentElement = document.getElementById(id);
////        var listeningElement = parentElement.querySelector('.listening');
////        var receivedElement = parentElement.querySelector('.received');

////        listeningElement.setAttribute('style', 'display:none;');
////        receivedElement.setAttribute('style', 'display:block;');

////        console.log('Received Event: ' + id);
////    }
////};

////app.initialize();

//var app = {
//    // Application Constructor
//    initialize: function () {
//        this.bindEvents();
//    },
//    // Bind Event Listeners
//    //
//    // Bind any events that are required on startup. Common events are:
//    // 'load', 'deviceready', 'offline', and 'online'.
//    bindEvents: function () {
//        document.addEventListener('deviceready', this.onDeviceReady, false);
//    },
//    // deviceready Event Handler
//    //
//    // The scope of 'this' is the event. In order to call the 'receivedEvent'
//    // function, we must explicitly call 'app.receivedEvent(...);'
//    onDeviceReady: function () {
//        app.receivedEvent('deviceready');

//        // Read NDEF formatted NFC Tags
//        nfc.addTagDiscoveredListener(
//            function (nfcEvent) {
//                var tag = nfcEvent.tag,
//                    ndefMessage = tag.ndefMessage;

//                // dump the raw json of the message
//                // note: real code will need to decode
//                // the payload from each record
//                alert(JSON.stringify(ndefMessage));

//                // assuming the first record in the message has 
//                // a payload that can be converted to a string.
//                alert(nfc.bytesToString(ndefMessage[0].payload).substring(3));
//            },
//            function () { // success callback
//                alert("Waiting for NDEF tag");
//            },
//            function (error) { // error callback
//                alert("Error adding NDEF listener " + JSON.stringify(error));
//            }
//        );
//    },
//    // Update DOM on a Received Event
//    receivedEvent: function (id) {
//        //var parentElement = document.getElementById(id);
//        //var listeningElement = parentElement.querySelector('.listening');
//        //var receivedElement = parentElement.querySelector('.received');

//        //listeningElement.setAttribute('style', 'display:none;');
//        //receivedElement.setAttribute('style', 'display:block;');

//        console.log('Received Event: ' + id);
//    }
//};

//app.initialize();














//var app = {
//    // Application Constructor
//    initialize: function () {
//        this.bindEvents();
//    },
//    // Bind Event Listeners
//    //
//    // Bind any events that are required on startup. Common events are:
//    // 'load', 'deviceready', 'offline', and 'online'.
//    bindEvents: function () {
//        document.addEventListener('deviceready', this.onDeviceReady, false);
//    },
//    // deviceready Event Handler
//    //
//    // The scope of 'this' is the event. In order to call the 'receivedEvent'
//    // function, we must explicitly call 'app.receivedEvent(...);'
//    onDeviceReady: function () {

//        try {
//            // Read NDEF formatted NFC Tags
//            nfc.addTagDiscoveredListener(
//                function (nfcEvent) {
//                    //window.location.href = "restaurant_connection_page.html?nfc=" + "1";
//                    var tag = nfcEvent.tag,
//                    ndefMessage = tag.ndefMessage;

                    

//                    if (window.location.href.indexOf("nfc_scanning_page.html") > -1) {
//                        window.location.href = "restaurant_connection_page.html?nfc=" + "1";
//                    }

//                    // dump the raw json of the message
//                    // note: real code will need to decode
//                    // the payload from each record
//                    alert(JSON.stringify(ndefMessage));

//                    // assuming the first record in the message has 
//                    // a payload that can be converted to a string.
//                    alert(nfc.bytesToString(ndefMessage[0].payload).substring(3));
//                },
//                function () { // success callback
//                    alert("Waiting for NDEF tag");
//                },
//                function (error) { // error callback
//                    alert("Error adding NDEF listener " + JSON.stringify(error));
//                }
//            );
//        } catch (ex) {
//            alert(ex.message);
//        }


//        app.receivedEvent('deviceready');

//    },
//    // Update DOM on a Received Event
//    receivedEvent: function (id) {
//        var parentElement = document.getElementById(id);
//        var listeningElement = parentElement.querySelector('.listening');
//        var receivedElement = parentElement.querySelector('.received');

//        listeningElement.setAttribute('style', 'display:none;');
//        receivedElement.setAttribute('style', 'display:block;');

//        console.log('Received Event: ' + id);
//    }
//};

//app.initialize();


        