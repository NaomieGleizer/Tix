document.addEventListener("DOMContentLoaded", function (event) {
    var client_last_orders = get_orders();
    
});


function get_orders() {
    var cookiearray  = (document.cookie).split(';');
    var orders = {};
    var order_number;
    var key;
    for (var i = 0; i < cookiearray .length; i++) {
        name = cookiearray[i].split('=')[0];
        value = cookiearray[i].split('=')[1];
        if (name === "num_of_orders") {
            continue;
        }
        order_number = name.charAt(name.length - 1);
        key = name.substr(0, name.length - 1);
        if (!(order_number in orders)) {
            orders[order_number] = {};
        }
        orders[order_number][key] = value;
    }
    return orders;
}


