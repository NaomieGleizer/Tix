document.addEventListener("DOMContentLoaded", function (event) {

    var restaurant_name = JSON.parse(sessionStorage.getItem("restaurant_name"));
    document.getElementById("restaurant_name").innerHTML = restaurant_name;

    document.getElementById("edit_restaurant_details").addEventListener("click", edit_details);

    document.getElementById("exit").addEventListener("click", function (e) {
        localStorage.removeItem("restaurant_id");
        const ipc = require('electron').ipcRenderer;
        // go back to main page
        ipc.send('load-page', 'file://' + __dirname + '/index.html');
    });

    // load table orders
    if (sessionStorage.getItem("orders")) {
        var orders = JSON.parse(sessionStorage.getItem("orders"));
        var table = document.getElementById("orders_table");
        for (var i = 0; i < orders.length; i++) {
            var table_id = orders[i][0];
            var new_row = table.insertRow(1);
            var td_table_id = new_row.insertCell(0);
            td_table_id.innerHTML = table_id;
            var td_table_order = new_row.insertCell(1);
            td_table_order.innerHTML = "";
            for (item in orders[i][1]) {
                td_table_order.innerHTML += item + ". ";
            }
        }
    }

    window.setInterval(get_orders, 3000);
});

function get_orders() {
    var restaurant_id = JSON.parse(sessionStorage.getItem("restaurant_id"));
    var table = document.getElementById("orders_table");
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://naomiegleizer.pythonanywhere.com/listen_to_orders?restaurant_id=" + restaurant_id, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            if (sessionStorage.getItem("orders")) {
                var orders = JSON.parse(sessionStorage.getItem("orders"));
            } else {
                var orders = [];
            }
            var data = JSON.parse(xhr.responseText);
            if (data.length > 0) {
                for (order_i in data) {
                    table_id = data[order_i].table_id;
                    order = data[order_i].order;
                    orders.push([table_id, order]);
                    var new_row = table.insertRow(1);
                    var td_table_id = new_row.insertCell(0);
                    td_table_id.innerHTML = table_id;
                    var td_table_order = new_row.insertCell(1);
                    td_table_order.innerHTML = "";
                    for (item in order) {
                        td_table_order.innerHTML += item + ". ";
                    }
                }
                sessionStorage.setItem("orders", JSON.stringify(orders));
            }
        }
    }
    xhr.send();
}

function edit_details() {
    const ipc = require('electron').ipcRenderer;
    ipc.send('load-page', 'file://' + __dirname + '/edit_restaurant_details.html');
}