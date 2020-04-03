document.addEventListener("DOMContentLoaded", function (event) {
    restaurant_name = JSON.parse(sessionStorage.getItem("restaurant_name"));
    document.getElementById("restaurant_name").innerHTML = restaurant_name;

    document.getElementById("edit_restaurant_details").addEventListener("click", edit_details);

    document.getElementById("exit").addEventListener("click", function (e) {
        localStorage.removeItem("restaurant_id");
        const ipc = require('electron').ipcRenderer;
        // go back to main page
        ipc.send('load-page', 'file://' + __dirname + '/index.html');
    });
 });


function edit_details() {
    const ipc = require('electron').ipcRenderer;
    ipc.send('load-page', 'file://' + __dirname + '/edit_restaurant_details.html');
}