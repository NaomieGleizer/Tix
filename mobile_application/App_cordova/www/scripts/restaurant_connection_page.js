document.addEventListener("DOMContentLoaded", function (event) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const nfc_code = urlParams.get('nfc');
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://127.0.0.1:5000/identify_restaurant_nfc", true);
    // sevrver returns an answer 
    xhr.onreadystatechange = function () {
        // if server accepted request, alert and return to index page
        if (xhr.readyState === 4 && xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            var welcome = document.getElementById("welcome");
            restaurant_name = data.restaurant_name;
            sessionStorage.setItem("restaurant_name", restaurant_name);
            welcome.innerHTML = " ברוכים הבאים ל" + restaurant_name;
            var div_menu = document.getElementById("menu");
            var index_row = 0;
            var id = 0;
            for (i in data.categories) {
                var category_div = document.createElement("div");
                var category = data.categories[i];
                category_div.className = "category_name";
                category_div.innerHTML = category.name;
                div_menu.appendChild(category_div);
                index_row += 1;
                for (j in category.menu_items) {
                    // item div wrapper - contains 2 div- item and add botton
                    var item_div = document.createElement("div");
                    item_div.className="item_div";
                    div_menu.appendChild(item_div);
                    // item content div - contains name, price and description
                    var item_content = document.createElement("div");
                    item_content.className="item_content";
                    item_div.appendChild(item_content);
                    // botton div
                    var item_add_btn = document.createElement("div");
                    item_add_btn.className = "add";
                    item_add_btn.innerHTML = '<button class="add_btn" id= ' + String(id)+' onclick="add_item_to_order(this)"  >+</button>';
                    item_div.appendChild(item_add_btn);
                    // name and price div  
                    var name_price_div = document.createElement("div");
                    name_price_div.className = "name_price_div";
                    item_content.appendChild(name_price_div);
                    // item name        
                    var item_name = document.createElement("div");  
                    item_name.id = "item_name" + String(id);
                    item_name.className = "item_name";
                    item_name.innerHTML = category.menu_items[j].item_name;
                    name_price_div.appendChild(item_name);    
                    // item price  
                    var item_price = document.createElement("div");
                    item_price.className = "item_price";
                    // add id 
                    item_price.id = "item_price" + String(id);
                    item_price.innerHTML = category.menu_items[j].item_price + "₪";
                    name_price_div.appendChild(item_price);   
                    // item description                            
                    var item_description = document.createElement("div");
                    item_description.className = "item_description";
                    item_description.innerHTML = category.menu_items[j].item_description;
                    item_content.appendChild(item_description);
                    id++;
                }
            }
        }
    }
    xhr.send(nfc_code);

    // add onclick events to buttons
    document.getElementById("my_order")
        .addEventListener("click", show_my_order);

    document.getElementById("exit")
        .addEventListener("click", exit_function);

});

function exit_function() {
        var txt;
        if (confirm("האם ברצונך להתנתק?")) {
            window.location.href = "index.html";
        } else {

        }
}

// client's order
var client_order = {};
var num_of_items = 0;
// add item to order 
function add_item_to_order(button_element) {
    id = button_element.id;
    item = document.getElementById("item_name" + id).innerText;
    price = parseInt(document.getElementById("item_price" + id).innerText);
    // if item is in order, increase sum in 1
    if (item in client_order) {
        client_order[item][0] += price;
        client_order[item][1] += 1;
    }
    // add item to order, element 0 is price, 1 is number of orders of this meal
    else {
        client_order[item] = [price, 1];     
    }
    num_of_items++;
    // update number of items in my order button
    document.getElementById("my_order").innerText = "ההזמנה שלי: " + String(num_of_items);

    //var keyName = window.sessionStorage.key(0); //Get key name
    //window.sessionStorage.setItem("key", "value"); //Set item
    //var value = window.sessionStorage.getItem("key");// Get item
    //window.sessionStorage.removeItem("key"); //Remove Item 
    //window.sessionStorage.clear();//Clear storage
}

// show client's order when click on "my order" button
function show_my_order() {
    sessionStorage.setItem("client_order_meals", JSON.stringify(client_order));
    window.location.href = "viewing_order.html";
}

