document.addEventListener("DOMContentLoaded", function (event) {
    // add onclick events to connect button
    document.getElementById("connect").addEventListener("click",
        function connect_to_restaurant() {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", "http://naomiegleizer.pythonanywhere.com/restaurant_side_connection", true);
            
            // sevrver returns an answer 
            xhr.onreadystatechange = function () {
                // if server accepted request, go to restaurant page
                if (xhr.readyState === 4 && xhr.status === 200) {
                    var data = JSON.parse(xhr.responseText);
                    //document.getElementById("test").innerHTML = "test";
                    sessionStorage.setItem("restaurant_id", JSON.stringify(data.id));
                    sessionStorage.setItem("restaurant_name", JSON.stringify(data.name));
                    const ipc = require('electron').ipcRenderer;
                    ipc.send('load-page', 'file://' + __dirname + '/restaurant_page.html');
                }
            }
            xhr.send();
    });
    }
);


