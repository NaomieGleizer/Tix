document.addEventListener("DOMContentLoaded", function (event) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const nfc_code = urlParams.get('nfc');
    // load num of items in order 
    load_num_of_items_in_order();
    // if page has been load already before, load menu
    if (sessionStorage.getItem("restaurant_details")) {
        data = JSON.parse(sessionStorage.getItem("restaurant_details"));
        show_menu(data, data.restaurant_name);
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
                sessionStorage.setItem("restaurant_details", JSON.stringify(data));
                sessionStorage.setItem("restaurant_id", JSON.stringify(data["restaurant_id"]));

                restaurant_name = data.restaurant_name;
                sessionStorage.setItem("restaurant_connection_name", restaurant_name);
                show_menu(data, restaurant_name);
            }
        };
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
        for (i = 0; i < sizes_radio.length; i++) {
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
        for (i = 0; i < choices_radio.length; i++) {
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


// add form to sizes and choices of meal
function add_size_and_choices_form(id, meal, adding_item_div) {
    var paragraph = document.createElement("p");
    var linebreak = document.createElement("br");
    var text = "";
    var option;
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
            option = document.createElement("input");
            option.setAttribute("type", "radio");
            option.setAttribute("name", "size");
            option.setAttribute("id", meal.item_name + "size" + String(j));
            description = sizes[j] + " ( ₪" + prices[j] + " )";
            option.setAttribute("value", description);
            label = document.createElement("label");
            label.setAttribute("for", "size");
            label.style.fontSize = "15px";
            text = document.createTextNode(description);
            linebreak = document.createElement("br");
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
            option = document.createElement("input");
            option.setAttribute("type", "radio");
            option.setAttribute("name", "choice");
            option.setAttribute("id", meal.item_name + "choice" + String(j));
            description = choices[j];
            option.setAttribute("value", description);
            label = document.createElement("label");
            label.setAttribute("for", "choice");
            label.style.fontSize = "15px";
            text = document.createTextNode(description);
            linebreak = document.createElement("br");
            label.appendChild(option);
            label.appendChild(text);
            label.appendChild(linebreak);
            sizes_choices_form.appendChild(label);
        }
    }
    sizes_choices_form.appendChild(paragraph);
    // button for adding meal to order
    adding_item_div.appendChild(sizes_choices_form);
    var add_btn = document.createElement("BUTTON");
    
    add_btn.setAttribute("id", "add_item" + String(id));
    add_btn.setAttribute("class", "add_to_order");
    add_btn.onclick = (function () {
        var button = add_btn;
        var m = meal;
        return function () {
            add_item_to_order(button, m);
        };
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
        };
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

features_to_categories = {
    "vegi_class": [],
    "vegan_class": [],
    "gluten_free_class": []
};


var there_is_vegi = false;
var there_is_vegan = false;
var there_is_gluten_free = false;


// show restaurant menu 
function show_menu(data, restaurant_name) {
    var welcome = document.getElementById("welcome");
    //restaurant_name = data.restaurant_name;
    //sessionStorage.setItem("restaurant_connection_name", restaurant_name);
    // welcome.innerHTML = " ברוכים הבאים ל" + restaurant_name;
    welcome.innerHTML = restaurant_name;
    var filter_by_feature_menu = document.getElementById("filter_by_feature_menu");
    var scrollable_menu_div = document.getElementById("scrollmenu");
    //var ul_menu = document.getElementById("ul_menu");
    var active = true;
    var table_menu = document.createElement("table");
    table_menu.setAttribute("id", "menu_table");
    var id = 0;
    // go over categories in menu 
    for (i in data.categories) {
        var category = data.categories[i];
        var category_a = document.createElement("tr");
        category_a.setAttribute("class", "category_a");
        category_a.setAttribute("id", String(category.name));
        table_menu.appendChild(category_a);
        var category_tr = document.createElement("tr");
        //category_tr.setAttribute("class", String(category.name));
        category_tr.setAttribute("class", ((String(category.name)).replace(/\s/g, '')));
        //category_tr.setAttribute("class", "name_of_category");
        var catrgory_th = document.createElement("td");
        catrgory_th.setAttribute("class", "category_name");
        catrgory_th.style.width = '100%';
        catrgory_th.appendChild(document.createTextNode(String(category.name)));
        category_tr.appendChild(catrgory_th);
        table_menu.appendChild(category_tr);
        var a_href_category = document.createElement("a");
        a_href_category.setAttribute("href", "#" + String(category.name));
        a_href_category.classList.add("link");
        if (active) {
            a_href_category.classList.add("active");
            active = false;
        }
        a_href_category.innerHTML = category.name;
        scrollable_menu_div.appendChild(a_href_category);



        //// trying menu 
        //var li_category = document.createElement("li");
        //li_category.setAttribute("href", "#" + String(category.name));
        //if (active) {
        //    li_category.setAttribute("class", "active");
        //    active = false;
        //}
        //li_category.innerHTML = category.name;
        //scrollable_menu_div.appendChild(li_category);








        // go over meals in category and add to table
        for (j in category.menu_items) {
            var meal_tr = document.createElement("tr");
            // meal name and description
            var td_meal = document.createElement("td");
            td_meal.style.width = '50%';
            td_meal.setAttribute("class", "item_name");
            td_meal.setAttribute("id", "item_name" + String(id));
            var name_span = document.createElement("span");
            name_span.style.cssFloat = "right";
            name_span.appendChild(document.createTextNode(category.menu_items[j].item_name));
            td_meal.appendChild(name_span);
            //td_meal.appendChild(document.createTextNode(category.menu_items[j].item_name));


            // if meal has a feature, add it to menu and save 
            if (category.menu_items[j].item_features) {
                features = (category.menu_items[j].item_features);
                more_than_one_feature = false;
                // else if meal is vegan, add vegan
                if (features.includes("מנה טבעונית")) {
                    if (!there_is_vegan) {
                        there_is_vegan = true;
                    }
                    var vegan_img = document.createElement("IMG");
                    vegan_img.setAttribute("class", "first_feature");
                    vegan_img.setAttribute("src", "images/vegan.png");
                    td_meal.appendChild(vegan_img);
                    more_than_one_feature = true;
                    //meal_tr.setAttribute("class", "vegan_class");
                    meal_tr.classList.add("vegan_class");
                    if (!features_to_categories["vegan_class"].includes((String(category.name)).replace(/\s/g, ''))) {
                        features_to_categories["vegan_class"].push((String(category.name)).replace(/\s/g, ''));
                    }
                }
                // if meal is vegi, add vegi
                else if (features.includes("מנה צמחונית")) {
                    if (!there_is_vegi) {
                        there_is_vegi = true;
                    }
                    // adding vegi image
                    var vegi_img = document.createElement("IMG");
                    vegi_img.setAttribute("class", "first_feature");
                    vegi_img.setAttribute("src", "images/vegi.png");
                    td_meal.appendChild(vegi_img);
                    more_than_one_feature = true;
                    //meal_tr.setAttribute("class", "vegi_class");
                    meal_tr.classList.add("vegi_class");
                    if (!features_to_categories["vegi_class"].includes((String(category.name)).replace(/\s/g, ''))) {
                        features_to_categories["vegi_class"].push((String(category.name)).replace(/\s/g, ''));
                    }
                    
                }
                // if meal is gluten free, add gluten free 
                if (features.includes("מנה ללא גלוטן")) {
                    if (!there_is_gluten_free) {
                        there_is_gluten_free = true;
                    }
                    // adding vegi image
                    var gluten_free_img = document.createElement("IMG");
                    if (more_than_one_feature) {
                        gluten_free_img.setAttribute("class", "second_feature");
                    }
                    else {
                        gluten_free_img.setAttribute("class", "first_feature");
                    }
                    gluten_free_img.setAttribute("src", "images/gluten_free.png");
                    td_meal.appendChild(gluten_free_img);
                    //meal_tr.setAttribute("class", "gluten_free_class");
                    meal_tr.classList.add("gluten_free_class");
                    if (!features_to_categories["gluten_free_class"].includes((String(category.name)).replace(/\s/g, ''))) {
                        features_to_categories["gluten_free_class"].push((String(category.name)).replace(/\s/g, ''));
                    }
                }
            }
            else {
                meal_tr.setAttribute("class", "no_feature_class");
            }







            //// adding vegi image
            //var vegi_img = document.createElement("IMG");
            //vegi_img.setAttribute("class", "gluten_free_img");
            //vegi_img.setAttribute("src", "images/gluten_free.png");
            ////name_span.appendChild(vegi_img);
            ////td_meal.appendChild(name_span);
            //td_meal.appendChild(vegi_img);


            // if there is description to meal, add it 
            if (category.menu_items[j].item_description) {
                var linebreak = document.createElement("br");
                td_meal.appendChild(linebreak);
                var span = document.createElement('span');
                span.style.fontSize = "15px";
                span.style.fontWeight = "normal";
                span.style.cssFloat = "right";
                span.appendChild(document.createTextNode(category.menu_items[j].item_description));
                td_meal.appendChild(span);
            }
            meal_tr.appendChild(td_meal);


           



            // meal price 
            var td_price = document.createElement("td");
            td_price.style.width = '17%';
            td_price.setAttribute("class", "item_price");
            td_price.setAttribute("id", "item_price" + String(id));


            span = document.createElement('span');
            span.style.textAlign = "left";
            span.appendChild(document.createTextNode(category.menu_items[j].item_price + "₪"));

            td_price.appendChild(span);


            //td_price.appendChild(document.createTextNode(category.menu_items[j].item_price + "₪"));
            meal_tr.appendChild(td_price);


            // adding meal to order button
            var td_add_btn = document.createElement("td");
            td_add_btn.style.width = '11%';
            td_add_btn.setAttribute("class", "add");
            var add_btn = document.createElement("BUTTON");
            add_btn.setAttribute("id", String(id));
            add_btn.setAttribute("class", "add_btn");
            add_btn.onclick = (function () {
                var button = add_btn;
                return function () {
                    select_size_and_choices(button);
                };
            })();
            add_btn.innerHTML = "+";
            td_add_btn.appendChild(add_btn);
            meal_tr.appendChild(td_add_btn);

            // adding meal image
            var td_image = document.createElement("td");
            td_image.style.width = '17%';
            var meal_img = document.createElement("IMG");
            meal_img.setAttribute("class", "meal_img");
            meal_img.setAttribute("src", "images/shakshuka.png");
            td_image.appendChild(meal_img);
            meal_tr.appendChild(td_image);


            // adding meal - select size and choices 
            var adding_meal_tr = document.createElement("tr");
            adding_meal_tr.setAttribute("class", "adding_meal_tr");
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

    if (there_is_vegi || there_is_vegan || there_is_gluten_free) {
        filter_by_feature_menu.innerHTML = "  מיין לפי";
        add_filters_btn("הכל", "all");
        if (there_is_vegi) {
            add_filters_btn("צמחוני", "vegi_class");
        }
        if (there_is_vegan) {
            add_filters_btn("טבעוני", "vegan_class");
        }
        if (there_is_gluten_free) {
            add_filters_btn("נטול גלוטן", "gluten_free_class");
        }
    }


    //if (meals_by_feature["vegi"]) {
    //    var vegi_btn = document.createElement("BUTTON");
    //    vegi_btn.setAttribute("id", "vegi_btn");
    //    vegi_btn.setAttribute("class", "add_btn");
    //    vegi_btn.onclick = (function () {
    //        var button = vegi_btn;
    //        return function () {
    //            //filter_by_feature(meals_by_feature["vegi"], data.restaurant_name);
    //            filter_meals_by_feature("vegi_class");
    //        }
    //    })();
    //    vegi_btn.innerHTML = "צמחוני";
    //    filter_by_feature_menu.appendChild(vegi_btn);
    //}
}



function filter_meals_by_feature(feature) {
    var table = document.getElementById("menu_table");
    var tr = table.getElementsByTagName("tr");
    if (feature === "all") {
        for (i = 0; i < tr.length; i++) {
            var tr_class = tr[i].className.split(" ");
            tr[i].style.display = "";
        }
    }
    else {
        var is_feature = false;
        for (i = 0; i < tr.length; i++) {
            tr_class = tr[i].className.split(" ");
            if (tr_class.includes(feature) || tr_class.includes("category_a") || features_to_categories[feature].includes(tr_class[0])) {
                tr[i].style.display = "";
                is_feature = true;
            }
            else if (is_feature && tr_class.includes("adding_meal_tr")) {
                tr[i].style.display = "";
                is_feature = false;
            }
            else {
                tr[i].style.display = "none";
            }
        }
    }
}


function add_filters_btn(type, class_type) {
    //vegi_class
    var btn = document.createElement("BUTTON");
    btn.setAttribute("class", "filter_btn");
    btn.onclick = (function () {
        return function () {
            filter_meals_by_feature(class_type);
        };
    })();
    btn.innerHTML = type;
    document.getElementById("filter_by_feature_menu").appendChild(btn);
}










