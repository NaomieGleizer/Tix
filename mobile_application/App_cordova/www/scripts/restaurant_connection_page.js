document.addEventListener("DOMContentLoaded", function (event) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const nfc_code = urlParams.get('nfc');
    // load num of items in order 
    load_num_of_items_in_order();
    // if page has been load already before, load menu
    if (sessionStorage.getItem("restaurant_menu")) {
        data = JSON.parse(sessionStorage.getItem("restaurant_menu"));
        show_menu(data);
    }
    // else, sent a request to server to get menu
    else {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "http://naomiegleizer.pythonanywhere.com/identify_restaurant_nfc", true);
        // sevrver returns an answer 
        xhr.onreadystatechange = function () {
            // if server accepted request, alert and return to index page
            if (xhr.readyState === 4 && xhr.status === 200) {
                var data = JSON.parse(xhr.responseText);
                sessionStorage.setItem("restaurant_menu", JSON.stringify(data));
                show_menu(data);
            }
        }
        //     xhr.setRequestHeader("Origin", 'naomie');
        //     xhr.withCredentials = true;
        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
        xhr.send(nfc_code);
    }

    // add onclick events to buttons
    document.getElementById("my_order")
        .addEventListener("click", show_my_order);

    document.getElementById("exit")
        .addEventListener("click", exit_function);

});

// exit from order
function exit_function() {
        var txt;
        if (confirm("האם ברצונך להתנתק?")) {
            // clear session storage before exit
            sessionStorage.clear();
            window.location.href = "index.html"; 
        } else {

        }
}

// if there are items in order, load them
if (sessionStorage.getItem("num_of_items")) {
    num_of_items = sessionStorage.getItem("num_of_items");
    client_order = JSON.parse(sessionStorage.getItem("client_order_meals"));
}
// else, initialize
else {
    var num_of_items = 0;
    var client_order = {};
}

// add item to order 
function add_item_to_order(button_element, meal) {
    var id = (button_element.id).slice(-1);
    var item = meal.item_name;
    var price = meal.item_price;
    var sizes = meal.item_sizes;
    var choices = meal.item_choices;
    var size = null;
    var choice = null;
    // if meal has sizes, check what user chose
    if (sizes) {
        var sizes_radio = document.getElementById("form" + String(id)).size;
        for (var i = 0; i < sizes_radio.length; i++) {
            if (sizes_radio[i].checked) {
                size = sizes_radio[i].value;
                size = size.split(" ")[0];
                price = (price.split(",").reverse())[i];
                (document.getElementById(item + "size" + String(i))).checked = false;
            }
        }
        // if user did not choose size, alert
        if (!size) {
            alert("לא נבחר גודל מנה");
            return;
        }
    }
    // if meal has sizes, check what user chose
    if (choices) {
        var choices_radio = document.getElementById("form" + String(id)).choice;
        for (var i = 0; i < choices_radio.length; i++) {
            if (choices_radio[i].checked) {
                choice = choices_radio[i].value;
                (document.getElementById(item + "choice" + String(i))).checked = false;
            }
        }
        // if user did not choose choice, alert
        if (!choice) {
            alert("לא נבחרו אפשרויות");
            return;
        }
    }
    price = parseFloat(price);
    // if item is in order, add it to list 
    if (item in client_order) {
        var to_push = true;
        // check if meal is in order with same choice and size
        for (i in client_order[item]) {
            // if yes, increase price and number of meal 
            if (client_order[item][i].includes(size) && client_order[item][i].includes(choice)) {
                client_order[item][i][0] += price;
                client_order[item][i][1] += 1;
                to_push = false;
                break;
            }
        }
        // if not, add to list 
        if (to_push) {
            client_order[item].push([price, 1, price, size, choice]);
        }
    }
    // else, add the meal to dictionary
    else {
        client_order[item] = [];
        client_order[item].push([price, 1, price, size, choice]);
    }
    num_of_items++;
    // update number of items in my order button
    document.getElementById("my_order").innerText = "ההזמנה שלי: " + String(num_of_items);
    document.getElementById("select_div" + id).style.display = "none";

    //var keyName = window.sessionStorage.key(0); //Get key name
    //window.sessionStorage.setItem("key", "value"); //Set item
    //var value = window.sessionStorage.getItem("key");// Get item
    //window.sessionStorage.removeItem("key"); //Remove Item 
    //window.sessionStorage.clear();//Clear storage
}

// show client's order when click on "my order" button
function show_my_order() {
    sessionStorage.setItem("client_order_meals", JSON.stringify(client_order));
    sessionStorage.setItem("num_of_items", num_of_items);
    window.location.href = "viewing_order.html";
}

// load num of items in order  
function load_num_of_items_in_order() {
    document.getElementById("my_order").innerText = "ההזמנה שלי: " + String(num_of_items);
}

// load menu 
function load_menu(data) {
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
            item_div.className = "item_div";
            div_menu.appendChild(item_div);
            // item content div - contains name, price and description
            var item_content = document.createElement("div");
            item_content.className = "item_content";
            item_div.appendChild(item_content);
            // botton div
            var item_add_btn = document.createElement("div");
            item_add_btn.className = "add";
            var add_btn = document.createElement("BUTTON");
            add_btn.setAttribute("id", String(id));
            add_btn.setAttribute("class", "add_btn");
            add_btn.onclick = (function () {
                var button = add_btn;
                return function () {
                    select_size_and_choices(button);
                }
            })();
            add_btn.innerHTML = "+";
            item_add_btn.appendChild(add_btn);
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
            // div for sizes and choices
            var adding_item_div = document.createElement("div");
            adding_item_div.setAttribute("id", "select_div" + String(id));
            adding_item_div.style.display = "none";
            adding_item_div.style.width = '100%';
            add_size_and_choices_form(id, category.menu_items[j], adding_item_div);
            item_content.appendChild(adding_item_div);
            id++;
        }
    }
}

// add form to sizes and choices of meal
function add_size_and_choices_form(id, meal, adding_item_div) {
    var paragraph = document.createElement("p");
    var linebreak = document.createElement("br");
    var sizes_choices_form = document.createElement("FORM");
    sizes_choices_form.setAttribute("id", "form" + String(id));
    var sizes_string = meal.item_sizes;
    var choices_string = meal.item_choices;
    // if there are sizes to meal, add selection
    if (sizes_string) {
        var sizes = sizes_string.split(",");
        var prices = meal.item_price.split(",").reverse();
        // go over sizes and add to form
        for (j in sizes) {
            var option = document.createElement("input");
            option.setAttribute("type", "radio");
            option.setAttribute("name", "size");
            option.setAttribute("id", meal.item_name + "size" + String(j));
            var description = sizes[j] + " ( ₪" + prices[j] + " )";
            option.setAttribute("value", description);
            var label = document.createElement("label");
            label.setAttribute("for", "size");
            var text = document.createTextNode(description);
            var linebreak = document.createElement("br");
            label.appendChild(option);
            label.appendChild(text);
            label.appendChild(linebreak);
            sizes_choices_form.appendChild(label);
        }
    }
    // if there are choices for meal, add selection
    if (choices_string) {
        var choices = choices_string.split(",");
        // go over choices and add to form
        for (j in choices) {
            var option = document.createElement("input");
            option.setAttribute("type", "radio");
            option.setAttribute("name", "choice");
            option.setAttribute("id", meal.item_name + "choice" + String(j));
            var description = choices[j];
            option.setAttribute("value", description);
            var label = document.createElement("label");
            label.setAttribute("for", "choice");
            var text = document.createTextNode(description);
            var linebreak = document.createElement("br");
            label.appendChild(option);
            label.appendChild(text);
            label.appendChild(linebreak);
            sizes_choices_form.appendChild(label);
        }
    }
    sizes_choices_form.appendChild(paragraph);
    // button for adding meal to order
    adding_item_div.appendChild(sizes_choices_form)
    var add_btn = document.createElement("BUTTON");
    add_btn.setAttribute("id", "add_item" + String(id));
    add_btn.setAttribute("class", "add_to_order");
    add_btn.onclick = (function () {
        var button = add_btn;
        var m = meal;
        return function () {
            add_item_to_order(button, m);
        }
    })();
    add_btn.innerHTML = "הוספת מנה";
    adding_item_div.appendChild(add_btn);
    // button for closing adding meal  
    var close_btn = document.createElement("BUTTON");
    close_btn.setAttribute("id", "close_btn" + String(id));
    close_btn.setAttribute("class", "add_to_order");
    close_btn.onclick = (function () {
        var button = close_btn;
        return function () {
            close_adding_meal(adding_item_div);
        }
    })();
    close_btn.innerHTML = "סגור";
    adding_item_div.appendChild(close_btn);
    adding_item_div.appendChild(linebreak);
}

// select size and choices for meal
function select_size_and_choices(button_element) {
    document.getElementById("select_div" + button_element.id).style.display = "table";
    
}

// close adding meal div
function close_adding_meal(adding_item_div) {
    adding_item_div.style.display = "none";
}

// show restaurant menu 
function show_menu(data) {
    var welcome = document.getElementById("welcome");
    restaurant_name = data.restaurant_name;
    sessionStorage.setItem("restaurant_name", restaurant_name);
    welcome.innerHTML = " ברוכים הבאים ל" + restaurant_name;
    var table_menu = document.createElement("table");
    table_menu.setAttribute("id", "menu_table");
    var id = 0;
    // go over categories in menu 
    for (i in data.categories) {
        // category name td
        var category = data.categories[i];
        var category_tr = document.createElement("tr");
        var catrgory_th = document.createElement("td");
        catrgory_th.setAttribute("class", "category_name");
        catrgory_th.style.width = '100%';
        catrgory_th.appendChild(document.createTextNode(String(category.name)));
        category_tr.appendChild(catrgory_th);
        table_menu.appendChild(category_tr);
        // go over meals in category and add to table
        for (j in category.menu_items) {
            var meal_tr = document.createElement("tr");
            // meal name and description
            var td_meal = document.createElement("td");
            td_meal.style.width = '70%';
            td_meal.setAttribute("class", "item_name");
            td_meal.setAttribute("id", "item_name" + String(id));
            td_meal.appendChild(document.createTextNode(category.menu_items[j].item_name));
            // if there is description to meal, add it 
            if (category.menu_items[j].item_description) {
                var linebreak = document.createElement("br");
                td_meal.appendChild(linebreak);
                var span = document.createElement('span');
                span.style.fontSize = "12px";
                span.appendChild(document.createTextNode(category.menu_items[j].item_description));
                td_meal.appendChild(span);
            }
            meal_tr.appendChild(td_meal);
            // meal price 
            var td_price = document.createElement("td");
            td_price.style.width = '15%';
            td_price.setAttribute("class", "item_name");
            td_price.setAttribute("id", "item_price" + String(id));
            td_price.appendChild(document.createTextNode(category.menu_items[j].item_price + "₪"));
            meal_tr.appendChild(td_price);
            // adding meal to order button
            var td_add_btn = document.createElement("td");
            td_add_btn.style.width = '10%';
            td_add_btn.setAttribute("class", "add");
            var add_btn = document.createElement("BUTTON");
            add_btn.setAttribute("id", String(id));
            add_btn.setAttribute("class", "add_btn");
            add_btn.onclick = (function () {
                var button = add_btn;
                return function () {
                    select_size_and_choices(button);
                }
            })();
            add_btn.innerHTML = "+";
            td_add_btn.appendChild(add_btn);
            meal_tr.appendChild(td_add_btn);
            // adding meal - select size and choices 
            var adding_meal_tr = document.createElement("tr");
            var td_adding_meal = document.createElement("td");
            var adding_item_div = document.createElement("div");
            adding_item_div.setAttribute("id", "select_div" + String(id));
            adding_item_div.style.display = "none";
            adding_item_div.style.width = '100%';
            // add form to select size and choices
            add_size_and_choices_form(id, category.menu_items[j], adding_item_div);
            td_adding_meal.appendChild(adding_item_div);
            adding_meal_tr.appendChild(td_adding_meal);
            table_menu.appendChild(meal_tr);
            table_menu.appendChild(adding_meal_tr);
            id++;
        }
    }
    document.getElementById("menu").appendChild(table_menu);
}