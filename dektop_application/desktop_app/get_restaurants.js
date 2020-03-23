document.addEventListener("DOMContentLoaded", function (event) {
    // open html request to server 
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://naomiegleizer.pythonanywhere.com/get_restaurants", true);
    // sevrver returns an answer 
    xhr.onreadystatechange = function () {
        // if server accepted request, alert and return to index page
        if (xhr.readyState === 4 && xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            var table = document.getElementById("myTable");
            for (var i = 0; i < data.length; i++) {
                var row = table.insertRow(i+1);
                for (var j = 0; j < 4; j++) {
                    var cell = row.insertCell(j);
                    cell.innerHTML = data[i][j];
                }
                var cell = row.insertCell(4);
                cell.innerHTML = '<button class="edit">מחק</button>';
            }
        }
    }
    xhr.send();

});