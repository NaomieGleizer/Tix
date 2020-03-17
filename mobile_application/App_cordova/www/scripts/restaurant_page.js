document.addEventListener("DOMContentLoaded", function (event) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const restaurant_name = urlParams.get('name');
    const restaurant_address = urlParams.get('address');
    const restaurant_phone = urlParams.get('phone');
    const restaurant_menu = JSON.parse(urlParams.get('menu'));

    var restaurant_name_div = document.getElementById("restaurant_name");
    restaurant_name_div.innerHTML = restaurant_name;

    var restaurant_address_div = document.getElementById("restaurant_address");
    restaurant_address_div.innerHTML = restaurant_address;

    var restaurant_phone_div = document.getElementById("restaurant_phone");
    restaurant_phone_div.innerHTML = restaurant_phone;

    var menu_div = document.getElementById("menu");
    console.log(restaurant_menu);
    for (i in restaurant_menu) {
        var category_div = document.createElement("div");
        var category = restaurant_menu[i];
        category_div.className = "category_name";
        category_div.innerHTML = category.name;
        menu_div.appendChild(category_div);

        for (j in category.menu_items) {

            // item content div - contains name, price and description
            var item_content = document.createElement("div");
            item_content.className = "item_content";
            menu_div.appendChild(item_content);
            
            // name and price div  
            var name_price_div = document.createElement("div");
            name_price_div.className = "name_price_div";
            item_content.appendChild(name_price_div);
            // item name        
            var item_name = document.createElement("div");
            item_name.className = "item_name";
            item_name.innerHTML = category.menu_items[j].item_name;
            name_price_div.appendChild(item_name);
            // item price  
            var item_price = document.createElement("div");
            item_price.className = "item_price";
            console.log(category.menu_items[j].item_price);
            item_price.innerHTML = category.menu_items[j].item_price + "₪";
            name_price_div.appendChild(item_price);
            // item description                            
            var item_description = document.createElement("div");
            item_description.className = "item_description";
            item_description.innerHTML = category.menu_items[j].item_description;
            item_content.appendChild(item_description);

        }

    }

});