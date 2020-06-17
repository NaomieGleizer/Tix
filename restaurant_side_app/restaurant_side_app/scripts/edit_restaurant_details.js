﻿var restaurant_id;
var restaurant_details_changes = {};
var details_changes_flag = false;
var menu_items_changes = {}
var item_changes_flag = false;
var menu_items_added = []
var item_added_flag = false;

document.addEventListener("DOMContentLoaded", function (event) {
    restaurant_id = JSON.parse(sessionStorage.getItem("restaurant_id"));

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://naomiegleizer.pythonanywhere.com/restaurant_side_get_details?restaurant_id=" + restaurant_id, true);
    // sevrver returns an answer 
    xhr.onreadystatechange = function () {
        // if server accepted request, go to restaurant page
        if (xhr.readyState === 4 && xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            show_details(data);
        }
    }

    xhr.send();
    document.getElementById("save_changes").addEventListener("click", update_changes);
    document.getElementById("exit_editing").addEventListener("click", exit_editing); 
});


function show_details(data) {
    var input_address_street = document.getElementById("address_street");
    var input_address_city = document.getElementById("address_city");
    var input_phone_number = document.getElementById("phone_number"); 

    input_address_street.value = data.address_street;
    input_address_city.value = data.address_city;
    input_phone_number.value = data.phone_number;
    

    input_address_city.addEventListener("change", details_changes);
    input_address_street.addEventListener("change", details_changes);
    input_phone_number.addEventListener("change", details_changes);

    document.getElementById("edit_menu").addEventListener("click", function () {
        this.parentNode.removeChild(this);
        var div_menu = document.getElementById("div_menu");

        // go over each category
        for (i in data.categories) {
            var category = data.categories[i];

            // add div for category and its items
            var category_div = document.createElement("div");
            category_div.className = "category_div";
            category_div.id = category.id;
            div_menu.appendChild(category_div);
            // add div for categroy name 
            var category_name_div = document.createElement("div");
            category_name_div.className = "category_name";
            category_name_div.innerHTML = category.name;
            category_div.appendChild(category_name_div);


            // go over each item in category
            for (j in category.menu_items) {  
                var item = category.menu_items[j]; 
                // item content div - contains name, price and description
                var item_content = document.createElement("div");
                item_content.id = item.id;
                item_content.className = "item_content";
                category_div.appendChild(item_content);
                
                // item name        
                var item_name = document.createElement("input");
                item_name.className = "item_name";
                item_name.value = item.item_name;
                item_name.addEventListener("change", menu_changes)
                item_content.appendChild(item_name);

                // item price  
                var item_price = document.createElement("input");
                item_price.className = "item_price";
                item_price.value = item.item_price;
                item_price.addEventListener("change", menu_changes);
                item_content.appendChild(item_price);

                // item description                            
                var item_description = document.createElement("input");
                item_description.className = "item_description";
                item_description.value = item.item_description;
                item_description.addEventListener("change", menu_changes);
                item_content.appendChild(item_description);              
            }
            // button for adding an item to category
            var add_item_btn = document.createElement("button");
            add_item_btn.class = "add_item_btn";
            add_item_btn.innerHTML = "הוסף מנה";
            add_item_btn.addEventListener("click", add_item);
            category_div.appendChild(add_item_btn);
        }
    });
};

function add_item() {
    // item div
    var item_content = document.createElement("div");
    item_content.className = "item_content";
    this.parentNode.appendChild(item_content);

    // item name        
    var item_name = document.createElement("input");
    item_name.className = "item_name";
    item_content.appendChild(item_name);

    // item price  
    var item_price = document.createElement("input");
    item_price.className = "item_price";
    item_content.appendChild(item_price);

    // item description                            
    var item_description = document.createElement("input");
    item_description.className = "item_description";
    item_content.appendChild(item_description);     

    // save item button
    var add_item_btn = document.createElement("button");
    add_item_btn.class = "save_item_btn";
    add_item_btn.innerHTML = "שמור מנה";
    add_item_btn.addEventListener("click", menu_new_items);
    item_content.appendChild(add_item_btn);

    // rebuild add button
    var add_item_btn = document.createElement("button");
    add_item_btn.class = "add_item_btn";
    add_item_btn.innerHTML = "הוסף מנה";
    add_item_btn.addEventListener("click", add_item);
    this.parentNode.appendChild(add_item_btn);
    this.parentNode.removeChild(this);

}


function details_changes(event) {
    try {
        restaurant_details_changes[this.id] = this.value;
        details_changes_flag = true;
        
    } catch (err) { alert("err in text_changed: " + err);}
};

function menu_changes() {
    // key is id of item and value is the pair of value's name and value that changed
    menu_items_changes[this.parentNode.id] = [this.className, this.value];
    item_changes_flag = true;
}

function menu_new_items() {
    
    var item_name = this.parentNode.childNodes[0].value;
    var item_price = this.parentNode.childNodes[1].value;
    var item_description = this.parentNode.childNodes[2].value;
    var category_id = this.parentNode.parentNode.id;
    
    //
    item = { "item_name": item_name, "item_price": item_price, "category_id": category_id };
    if (item_description!="") {
        item["item_description"] = item_description;
    }
    menu_items_added.push(item);
    item_added_flag = true;
    this.parentNode.removeChild(this);
}

function update_changes() {
    var send_obj = {}
    if (details_changes_flag) {
        send_obj["details_changes"] = restaurant_details_changes;
        details_changes_flag = false;
        restaurant_details_changes = {};
    }
    if (item_changes_flag) {
        send_obj["menu_items_changes"] = menu_items_changes;
        item_changes_flag = false;
        menu_items_changes = {};
    }
    if (item_added_flag) {
        send_obj["menu_items_added"] = menu_items_added;
        item_added_flag = false;
        menu_items_added = [];
    }
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://naomiegleizer.pythonanywhere.com/restaurant_side_update_details?restaurant_id=" + restaurant_id, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        // if server accepted request,
        if (xhr.readyState === 4 && xhr.status === 200) {
            alert("השינויים נשמרו בהצלחה");
        }
    }
    xhr.send(JSON.stringify(send_obj));
};


function exit_editing() {
    const ipc = require('electron').ipcRenderer;
    ipc.send('load-page', 'file://' + __dirname + '/restaurant_page.html');
};