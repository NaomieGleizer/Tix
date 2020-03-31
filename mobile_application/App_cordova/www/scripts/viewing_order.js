document.addEventListener("DOMContentLoaded", function (event) {
    meals = JSON.parse(sessionStorage.getItem("client_order_meals"));
    document.getElementById("rest_name").innerHTML = sessionStorage.getItem("restaurant_name");
    var i;
    var total_price = 0;
    var id = 0;
    // create a table with order items 
    for (var meal in meals) {
        var tr = document.createElement("TR");
        tr.setAttribute("id", "item" + String(id));
        document.getElementById("order_items").appendChild(tr);
        // meal name
        var td_meal = document.createElement("TD");
        td_meal.setAttribute("id", "meal" + String(id));
        td_meal.style.width = '70%';
        var text = document.createTextNode(meal + ' ' + String(meals[meal][1]) + 'x');
        td_meal.appendChild(text);
        document.getElementById("item" + String(id)).appendChild(td_meal);
        // meal price
        var td_price = document.createElement("TD");
        td_price.setAttribute("id", "price" + String(id));
        td_price.style.width = '10%';
        var text2 = document.createTextNode(String(meals[meal][0]));
        td_price.appendChild(text2);
        document.getElementById("item" + String(id)).appendChild(td_price);
        // add meal button
        var td_btn_add = document.createElement("TD");
        td_btn_add.style.width = '10%';
        td_btn_add.setAttribute("id", "td+" + String(id));
        var btn2 = document.createElement("BUTTON");
        btn2.setAttribute("id", String(id) + "+");
        btn2.setAttribute("class", "remove_btn");
        btn2.innerHTML = "+";
        btn2.onclick = (function () {
            var m = meal;
            var b = btn2;
            var me = meals;
            return function () {
                add_item(b, me, m);
            }
        })();
        td_btn_add.appendChild(btn2);
        document.getElementById("item" + String(id)).appendChild(td_btn_add);
        // remove meal button
        var td_btn_remove = document.createElement("TD");
        td_btn_remove.style.width = '10%';
        td_btn_remove.setAttribute("id", "td-" + String(id));
        var btn = document.createElement("BUTTON");
        btn.setAttribute("id", String(id) + "-");
        btn.setAttribute("class", "remove_btn");
        btn.innerHTML = "-";
        btn.onclick = (function () {
            var m = meal;
            var b = btn;
            var me = meals;
            return function () {
                remove_item_from_order(b, me, m);
            }
        })();
        td_btn_remove.appendChild(btn);
        document.getElementById("item" + String(id)).appendChild(td_btn_remove);
        total_price += meals[meal][0];
        id += 1;
    }
    // update total price
    document.getElementById("total_price").innerHTML = "סכום כולל: " + String(total_price);
    sessionStorage.setItem("total_price", total_price);

    // add onclick events to buttons
    document.getElementById("back_to_menu")
        .addEventListener("click", back_to_menu);

    document.getElementById("paying")
        .addEventListener("click", paying);

});


// back to menu
function back_to_menu() {
    window.location.href = "restaurant_connection_page.html";
}

// go to purchase summary
function paying() {
    window.location.href = "purchase_summary.html";
}

// remove item from order
function remove_item_from_order(button_element, meals, meal_name) {
    var id = String(button_element.id).slice(0, -1);
    var meal = meals[meal_name];
    var meal_price = meal[2];
    // if number of meal is bigger than 1, update
    if (meal[1] > 1) {
        document.getElementById("meal" + id).innerText = meal_name + " " + String(meal[1] - 1) + "x";
        meals[meal_name][0] -= meal_price;
        meals[meal_name][1] -= 1;
        document.getElementById("price" + id).innerText = String(meal[0]);
    }
    // remove meal from order
    else {
        var elem = document.getElementById("item" + id);
        elem.parentNode.removeChild(elem);
        delete meals[meal_name];
    }
    // update total price and client order in session storage
    total_price = sessionStorage.getItem("total_price") - meal_price;
    sessionStorage.setItem("total_price", total_price);
    document.getElementById("total_price").innerHTML = "סכום כולל: " + String(total_price);
    sessionStorage.setItem("client_order_meals", JSON.stringify(meals));
    var num_of_items = sessionStorage.getItem("num_of_items") - 1;
    sessionStorage.setItem("num_of_items", num_of_items);
}

// add item to order
function add_item(button_element, meals, meal_name) {
    var id = String(button_element.id).slice(0, -1);
    var meal = meals[meal_name];
    var meal_price = meal[2];
    document.getElementById("meal" + id).innerText = meal_name + " " + String(meal[1] + 1) + "x";
    meals[meal_name][0] += meal_price;
    meals[meal_name][1] += 1;
    document.getElementById("price" + id).innerText = String(meal[0]);
 
    // update total price and client order in session storage
    total_price = parseFloat(sessionStorage.getItem("total_price")) + parseFloat(meal_price);
    sessionStorage.setItem("total_price", total_price);
    document.getElementById("total_price").innerHTML = "סכום כולל: " + String(total_price);
    sessionStorage.setItem("client_order_meals", JSON.stringify(meals));
    var num_of_items = parseInt(sessionStorage.getItem("num_of_items")) + 1;
    sessionStorage.setItem("num_of_items", num_of_items);
}