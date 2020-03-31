document.addEventListener("DOMContentLoaded", function (event) {
    // add event listeners to buttons
    document.getElementById("confirm_tabels").addEventListener("click",
        // adding input text to add tabels's NFC
        function add_tabels() {
            // get number of tabels
            var num_of_tabels = document.getElementById("tabels_mumber").value;
            var i;
            var inputs = "<h5>NFC " + "הכנסת מספרי</h5><br/>";
            // add input texts as number of tabels 
            for (i = 0; i < num_of_tabels; i++) {
                inputs += '<input type="text" id="tabel' + String(i) + '" name="tabel"/><br/>';
            }
            inputs += "<br/>"
            // for check 
            console.log(String(inputs));
            // put in html div 
            document.getElementById("adding_tabels").innerHTML = inputs;
        });
    // add resturant to system 
    document.getElementById("submit").addEventListener("click",
        function add_restaurant() {
            // open html request to server 
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "http://naomiegleizer.pythonanywhere.com/add_restaurant", true);
            // sevrver returns an answer 
            xhr.onreadystatechange = function () {
                // if server accepted request, alert and return to index page
                if (xhr.readyState === 4 && xhr.status === 200) {
                    alert("המסעדה נרשמה בהצלחה!");
                    const ipc = require('electron').ipcRenderer;
                    ipc.send('load-page', 'file://' + __dirname + '/index.html');
                }
            }
            // get form
            var formData = new FormData(document.getElementById("adding_form"));
            var num_of_tabels = document.getElementById("tabels_mumber").value;
            // for check
            console.log(String(num_of_tabels));
            formData.delete("tabel")
            // add tebels's NFC to form data
            for (i = 0; i < num_of_tabels; i++) {
                formData.append("tabel" + String(i), String(document.getElementById("tabel" + String(i)).value));
            }
            // sent form data to server
            xhr.send(formData);
        });
    }
);