document.addEventListener("DOMContentLoaded", function (event) {
    meals = JSON.parse(sessionStorage.getItem("client_order_meals"));
    document.getElementById("rest_name").innerHTML = sessionStorage.getItem("restaurant_name");
    var i;
    var total_price = 0;
    var id = 0;
    // create a table with order items 
    for (var meal in meals) {
        for (i in meals[meal]) {
            var tr = document.createElement("TR");
            tr.setAttribute("id", "item" + String(id));
            document.getElementById("order_items").appendChild(tr);
            // meal name
            var td_meal = document.createElement("TD");
            td_meal.setAttribute("id", "meal" + String(id));
            td_meal.style.width = '80%';
            var comments = "";
            // if there is size to meal, add to comments
            if (meals[meal][i][3]) {
                comments += String(meals[meal][i][3]);
            }
            // if there is choice to meal, add to comments
            if (meals[meal][i][4]) {
                if (comments !== "") {
                    comments += ", ";
                }
                comments += "עם " + String(meals[meal][i][4]);
            }
            var text = document.createTextNode(meal + ' ' + String(meals[meal][i][1]) + 'x');
            td_meal.appendChild(text);
            // if there are comments, add to table
            if (comments !== "") {
                var linebreak = document.createElement("br");
                td_meal.appendChild(linebreak);
                var comments_text = document.createTextNode(comments);
                var span = document.createElement('span');
                span.style.fontSize = "12px";
                span.appendChild(comments_text);
                td_meal.appendChild(span);
            }
            document.getElementById("item" + String(id)).appendChild(td_meal);
            // meal price
            var td_price = document.createElement("TD");
            td_price.setAttribute("id", "price" + String(id));
            td_price.style.width = '10%';
            var text2 = document.createTextNode(String(meals[meal][i][0]) + "₪");
            td_price.appendChild(text2);
            document.getElementById("item" + String(id)).appendChild(td_price);
            // remove meal button
            var td_btn_remove = document.createElement("TD");
            td_btn_remove.style.width = '10%';
            td_btn_remove.setAttribute("id", "td-" + String(id));
            var btn = document.createElement("BUTTON");
            btn.setAttribute("id", String(id) + "-");
            btn.setAttribute("class", "remove_btn");
            btn.innerHTML = "-";
            btn.onclick = (function () {
                var meal_name = meal;
                var button = btn;
                var me = meals;
                var meal_element = meals[meal][i];
                return function () {
                    remove_item_from_order(button, me, meal_element, meal_name, comments);
                };
            })();
            td_btn_remove.appendChild(btn);
            document.getElementById("item" + String(id)).appendChild(td_btn_remove);
            total_price += parseFloat(meals[meal][i][0]);
            id += 1;
        }
    }

    // already sent order
    if (sessionStorage.getItem("client_sent_order")) {
        already_sent_order();
    }

    // update total price
    document.getElementById("total_price").innerHTML = "סכום כולל: " + String(total_price) + "₪";
    sessionStorage.setItem("total_price", total_price);

    // add onclick events to buttons
    document.getElementById("back_to_menu")
        .addEventListener("click", back_to_menu);

    document.getElementById("paying")
        .addEventListener("click", paying);

    document.getElementById("order")
        .addEventListener("click", ordering);

});

// already sent order
function already_sent_order() {
    var old_order = JSON.parse(sessionStorage.getItem("client_sent_order"));
    var sent_order_div = document.getElementById("sent_order_div");
    var sent_order_title = document.createElement("div");
    sent_order_title.innerHTML = "הזמנות שנשלחו:";
    sent_order_title.setAttribute("style", "text-align:center; font-weight: bold; margin-bottom:5%;");
    sent_order_div.appendChild(sent_order_title);
    for (var meal in old_order) {
        for (i in old_order[meal]) {
            var div_meal = document.createElement("div");
            div_meal.style.display = "flex";
            div_meal.className = "div_meal"
            sent_order_div.appendChild(div_meal);
            var div_meal_name = document.createElement("div");
            div_meal_name.innerHTML = meal + ' ' + String(old_order[meal][i][1]) + 'x';
            div_meal_name.style.width = "80%";
            var div_meal_price = document.createElement("div");
            div_meal_price.innerHTML = String(old_order[meal][i][0]) + "₪";
            div_meal_price.setAttribute("style", "text-align:center; width:20%;");
            div_meal.appendChild(div_meal_name);
            div_meal.appendChild(div_meal_price);
        }
    }
}


// back to menu
function back_to_menu() {
    window.location.href = "restaurant_connection_page.html";
}

// go to purchase summary
function paying() {
    window.location.href = "purchase_summary.html";
}

// add item to order
function add_item(button_element, meals, meal_name) {
    var id = String(button_element.id).slice(0, -1);
    var meal = meals[meal_name];
    var meal_price = meal[2];
    document.getElementById("meal" + id).innerText = meal_name + " " + String(meal[1] + 1) + "x";
    meals[meal_name][0] += meal_price;
    meals[meal_name][1] += 1;
    document.getElementById("price" + id).innerText = String(meal[0]) + "₪";
    // update total price and client order in session storage
    total_price = parseFloat(sessionStorage.getItem("total_price")) + parseFloat(meal_price);
    sessionStorage.setItem("total_price", total_price);
    document.getElementById("total_price").innerHTML = "סכום כולל: " + String(total_price) + "₪";
    sessionStorage.setItem("client_order_meals", JSON.stringify(meals));
    var num_of_items = parseInt(sessionStorage.getItem("num_of_items")) + 1;
    sessionStorage.setItem("num_of_items", num_of_items);
}


// remove item from order
function remove_item_from_order(button_element, meals, meal, meal_name, comments) {
    var id = String(button_element.id).slice(0, -1);
    //var meal = meals[meal_name][index];
    var meal_price = meal[2];
    // if number of meal is bigger than 1, update
    if (meal[1] > 1) {
        document.getElementById("meal" + id).innerText = meal_name + " " + String(meal[1] - 1) + "x";
        //document.getElementById("meal" + id).innerText = String(meal[1] - 1) + "x";
        meal[0] -= meal_price;
        meal[1] -= 1;
        document.getElementById("price" + id).innerText = String(meal[0]) + "₪";
        if (comments !== "") {
            var linebreak = document.createElement("br");
            document.getElementById("meal" + id).appendChild(linebreak);
            var comments_text = document.createTextNode(comments);
            var span = document.createElement('span');
            span.style.fontSize = "12px";
            span.appendChild(comments_text);
            document.getElementById("meal" + id).appendChild(span);
        }
    }
    // remove meal from order
    else {
        var elem = document.getElementById("item" + id);
        elem.parentNode.removeChild(elem);
        if (meals[meal_name].length > 1) {
            //delete meals[meal_name][index];
            var index = meals[meal_name].indexOf(meal);
            if (index !== -1) meals[meal_name].splice(index, 1);
        }
        else {
            //var index = meals.indexOf(meal_name);
            //if (index !== -1) meals.splice(index, 1);
            delete meals[meal_name];
        }
    }
    // update total price and client order in session storage
    total_price = sessionStorage.getItem("total_price") - meal_price;
    sessionStorage.setItem("total_price", total_price);
    document.getElementById("total_price").innerHTML = "סכום כולל: " + String(total_price) + "₪";
    sessionStorage.setItem("client_order_meals", JSON.stringify(meals));
    var num_of_items = sessionStorage.getItem("num_of_items") - 1;
    sessionStorage.setItem("num_of_items", num_of_items);
}


function ordering() {
    var restaurant_id = JSON.parse(sessionStorage.getItem("restaurant_id"));
    var meals = JSON.parse(sessionStorage.getItem("client_order_meals"));
    if (meals)
        var order_to_send = { "restaurant_id": restaurant_id, "table_id": "1", "order": meals };
    var xhr = new XMLHttpRequest();

    xhr.open("POST", "http://naomiegleizer.pythonanywhere.com/new_order", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    // sevrver returns an answer 
    xhr.onreadystatechange = function () {
        // if server accepted request, alert and return to index page
        if (xhr.readyState === 4 && xhr.status === 200) {
            sessionStorage.removeItem("client_order_meals");
            sessionStorage.removeItem("num_of_items");
            if (sessionStorage.getItem("client_sent_order")) {
                var old_order = JSON.parse(sessionStorage.getItem("client_sent_order"));
                for (meal in meals) {
                    if (meal in old_order) {
                        old_order[meal] = old_order[meal].concat(meals[meal]);
                    }
                    else {
                        old_order[meal] = old_order[meal];
                    }
                }
                sessionStorage.setItem("client_sent_order", JSON.stringify(old_order));
            }
            else {
                sessionStorage.setItem("client_sent_order", JSON.stringify(meals));
            }

            // cookies check
            ///////////////////
            save_order();

            alert("ההזמנה בוצעה");
            back_to_menu();
        }
    }
    xhr.send(JSON.stringify(order_to_send));


}


function setCookie() {
    var expires = "expires=Thu, 03 Sep 2020 00:00:00 UTC;";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    var num_of_orders = getCookie("num_of_orders");
    if (num_of_orders !== "") {
        num_of_orders = parseInt(num_of_orders) + 1; 
    }
    else {
        num_of_orders = 1;
    }
    var order = String(sessionStorage.getItem("client_sent_order"));
    var rest_name = String(sessionStorage.getItem("restaurant_connection_name"));
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear();
    var full_date = String(day) + "/" + String(month) + "/" + String(year);

    //order += " " + full_date;
    
    document.cookie = "num_of_orders" + "=" + String(num_of_orders) + ";" + expires + "path=/";
    document.cookie = "order" + String(num_of_orders) + "=" + order + ";" + expires + "path=/";
    document.cookie = "date" + String(num_of_orders) + "=" + full_date + ";" + expires + "path=/";
    document.cookie = "rest_name" + String(num_of_orders) + "=" + rest_name + ";" + expires + "path=/";
}


function getCookie(key) {
    var name = key + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}



function save_order() {
    var num_of_orders = window.localStorage.getItem("num_of_orders"); 
    if (num_of_orders === null) {
        num_of_orders = 1;
    }
    else {
        num_of_orders = parseInt(num_of_orders) + 1;
    }
    var order = sessionStorage.getItem("client_sent_order");
    var rest_name = sessionStorage.getItem("restaurant_connection_name");
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var full_date = String(day) + "/" + String(month) + "/" + String(year);

    localStorage.setItem("num_of_orders", String(num_of_orders));
    localStorage.setItem("order" + String(num_of_orders), order);
    localStorage.setItem("date" + String(num_of_orders), full_date);
    localStorage.setItem("rest_name" + String(num_of_orders), rest_name);
}