document.addEventListener("DOMContentLoaded", function (event) {
    var last_orders = get_last_orders();
    var client_last_orders = last_orders[0];
    var num_of_orders = last_orders[1];
    var order_date;
    var order_rest_name;
    var txt = document.createTextNode("לחץ לפרטי הזמנה");
    var last_order_btn;
    var br = document.createElement("br");
    var p = document.createElement("p");
    for (var i = 0; i < num_of_orders; i++) {
        order_date = document.createTextNode(" " + String(client_last_orders[i + 1]["date"]));
        order_rest_name = document.createTextNode(client_last_orders[i + 1]["rest_name"]);
        last_order_btn = document.createElement("BUTTON");
        last_order_btn.setAttribute("class", "last_order_btn");
        last_order_btn.appendChild(order_rest_name);
        last_order_btn.appendChild(br);
        last_order_btn.appendChild(order_date);
        last_order_btn.appendChild(br);
        last_order_btn.appendChild(txt);
        last_order_btn.onclick = (function () {
            var order_number = i + 1;
            return function () {
                sessionStorage.setItem("last_order", JSON.stringify(client_last_orders[order_number]));
                window.location.href = "last_order_page.html";
            };
        })();
        document.getElementById("last_orders_div").appendChild(last_order_btn);
        document.getElementById("last_orders_div").appendChild(p);
    }
});


//function show_last_order(order) {

//}

//function get_orders() {
//    var cookiearray  = (document.cookie).split(';');
//    var orders = {};
//    var order_number;
//    var key;
//    for (var i = 0; i < cookiearray .length; i++) {
//        name = cookiearray[i].split('=')[0];
//        value = cookiearray[i].split('=')[1];
//        if (name === "num_of_orders") {
//            continue;
//        }
//        order_number = name.charAt(name.length - 1);
//        key = name.substr(0, name.length - 1);
//        if (!(order_number in orders)) {
//            orders[order_number] = {};
//        }
//        orders[order_number][key] = value;
//    }
//    return orders;
//}


function get_last_orders() {
    var orders = {};
    var num_of_orders = window.localStorage.getItem("num_of_orders");
    if (num_of_orders === null) {
        return orders;
    }
    var order_number;
    var key;
    var rest_name;
    var date;
    var order; 
    for (var i = 0; i < num_of_orders; i++) {
        order_number = i + 1;
        rest_name = window.localStorage.getItem("rest_name" + String(order_number));
        date = window.localStorage.getItem("date" + String(order_number));
        order = window.localStorage.getItem("order" + String(order_number));
        orders[order_number] = {};
        orders[order_number]["rest_name"] = rest_name;
        orders[order_number]["date"] = date;
        orders[order_number]["order"] = order;  
    }
    return [orders, num_of_orders];
}

