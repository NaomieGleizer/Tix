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
                    comments += ", "
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
                }
            })();
            td_btn_remove.appendChild(btn);
            document.getElementById("item" + String(id)).appendChild(td_btn_remove);
            total_price += parseFloat(meals[meal][i][0]);
            id += 1;
        }
    }
    // update total price
    document.getElementById("total_price").innerHTML = "סכום כולל: " + String(total_price) + "₪";
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