var restaurant_id;
document.addEventListener("DOMContentLoaded", function (event) {
    document.getElementById("add_category").addEventListener("click", add_category); 
    document.getElementById("save_menu").addEventListener("click", add_menu);
    restaurant_id = JSON.parse(sessionStorage.getItem("restaurant_id"));
    document.getElementById("exit_editing").addEventListener("click", exit_editing);


});

function add_category() {
    var div_menu = document.getElementById("menu");

    var name = document.createElement("h3");
    name.innerHTML = "שם קטגוריה";
    div_menu.appendChild(name);

    // add div for category and its items
    var category_div = document.createElement("div");
    category_div.className = "category_div";
    div_menu.appendChild(category_div);

    
    // add div for categroy name 
    var category_name = document.createElement("input");
    category_name.className = "category_name";
    category_div.appendChild(category_name);


    // button for adding an item to category
    var add_item_btn = document.createElement("button");
    add_item_btn.class = "add_item_btn";
    add_item_btn.innerHTML = "הוסף מנה";
    add_item_btn.addEventListener("click", add_item);
    category_div.appendChild(add_item_btn);
    this.parentNode.removeChild(this);
    new_category = document.createElement("button");
    new_category.innerHTML = "הוסף קטגוריה"
    new_category.id = "add_category";
    new_category.addEventListener("click", add_category);
    div_menu.appendChild(new_category);

   

};

function add_item() {
    var titles = document.createElement("div");
    titles.className = "titles";

    var name = document.createElement("h4");
    name.innerHTML = "שם מנה";
    name.style.width = "190px";
    titles.appendChild(name);

    var description = document.createElement("h4");
    description.innerHTML = "תיאור מנה";
    description.style.width = "530px";
    titles.appendChild(description);
    this.parentNode.appendChild(titles);

    var choices = document.createElement("h4");
    choices.innerHTML = "תוספות";
    choices.style.width = "280px";
    titles.appendChild(choices);

    var sizes = document.createElement("h4");
    sizes.innerHTML = "גדלים";
    sizes.style.width = "200px";
    titles.appendChild(sizes);

    var price = document.createElement("h4");
    price.innerHTML = "מחיר מנה";
    price.style.width = "150px";
    titles.appendChild(price);

    var veganOrGF = document.createElement("h4");
    veganOrGF.innerHTML = "מנה טבעונית/ללא גלוטן";
    veganOrGF.style.width = "180px";
    titles.appendChild(veganOrGF);

    var image = document.createElement("h4");
    image.innerHTML = "הוסף תמונה";
    image.style.width = "180px";
    titles.appendChild(image);

    // item div
    var item_content = document.createElement("div");
    item_content.className = "item_content";
    this.parentNode.appendChild(item_content);

    // item name        
    var item_name = document.createElement("input");
    item_name.className = "item_name";
    item_name.style.width = "10%";
    item_content.appendChild(item_name);

    // item description                            
    var item_description = document.createElement("input");
    item_description.className = "item_description";
    item_description.style.width = "30%";
    item_content.appendChild(item_description);

    // item choises        
    var item_choises = document.createElement("input");
    item_choises.className = "item_choice";
    item_choises.style.width = "15%";
    item_content.appendChild(item_choises);

    // item sizes        
    var item_sizes = document.createElement("input");
    item_sizes.className = "item_choice";
    item_sizes.style.width = "10%";
    item_content.appendChild(item_sizes);

    // item price  
    var item_price = document.createElement("input");
    item_price.className = "item_price";
    item_price.style.width = "7%";
    item_content.appendChild(item_price);

    // item vegan or gluten free  
    var item_feature = document.createElement("select");
    item_feature.className = "item_select";
    item_feature.style.width = "6%";
    var opt0 = document.createElement('option');
    opt0.innerHTML = "מנה רגילה";
    item_feature.appendChild(opt0);
    var opt1 = document.createElement('option');
    opt1.innerHTML = "מנה טבעונית";
    item_feature.appendChild(opt1);
    var opt2 = document.createElement('option');
    opt2.innerHTML = "מנה ללא גלוטן";
    item_feature.appendChild(opt2);
    item_content.appendChild(item_feature);
    opt3.innerHTML = "מנה צמחונית";
    item_feature.appendChild(opt3);
    item_content.appendChild(item_feature);

    // item image
    var item_image = document.createElement("input");
    item_image.type = "file";
    item_image.className = "item_image";
    item_image.style.width = "12%";
    item_content.appendChild(item_image);

    // rebuild add button
    var add_item_btn = document.createElement("button");
    add_item_btn.class = "add_item_btn";
    add_item_btn.innerHTML = "הוסף מנה";
    add_item_btn.addEventListener("click", add_item);
    this.parentNode.appendChild(add_item_btn);
    this.parentNode.removeChild(this);

}


function add_menu() {
    var menu = {};
    var items_in_category;
    var categories = document.getElementsByClassName("category_div");
    for (i = 0; i < categories.length; i++) {
        var category = categories[i];
        items_in_category = [];
        var items = category.children;
        for (j in items) {
            var item = items[j];
            if (item.className == 'category_name') {
                var category_name = item.value;
                continue;
            }
            else if (item.className != 'item_content') {
                continue;
            }
            var item_in_items = {};
            for (k in item.children) {
                item_detail = item.children[k];
                if (item_detail.className == 'item_name') {
                    item_in_items['name'] = item_detail.value;
                }
                else if (item_detail.className == 'item_description') {
                    item_in_items['description'] = item_detail.value;
                }
                else if (item_detail.className == 'item_choices') {
                    item_in_items['choices'] = item_detail.value;
                }
                else if (item_detail.className == 'item_sizes') {
                    item_in_items['sizes'] = item_detail.value;
                }
                else if (item_detail.className == 'item_image') {
                    
                }
                else if (item_detail.className == 'item_price') {
                    item_in_items['price'] = item_detail.value;
                }
                else if (item_detail.className == 'item_select') {
                    item_in_items['select'] = item_detail.value;
                }
            }
            items_in_category.push(item_in_items);
        }
        menu[category_name] = items_in_category;
    }
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://naomiegleizer.pythonanywhere.com/restaurant_side_add_menu?restaurant_id=" + restaurant_id, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        // if server accepted request,
        if (xhr.readyState === 4 && xhr.status === 200) {
            var data = xhr.responseText;
        }
    }
    xhr.send(JSON.stringify(menu));
}

function exit_editing() {
    const ipc = require('electron').ipcRenderer;
    ipc.send('load-page', 'file://' + __dirname + '/restaurant_page.html');
};