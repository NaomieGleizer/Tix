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
            restaurant_name = data.name;
            welcome.innerHTML = " ברוכים הבאים ל" + restaurant_name;
            menu = JSON.parse(data.menu);
            console.log(menu);
            var div_menu = document.getElementById("menu");
            var index_row = 0;
            for (i in menu.categories) {
                var category_div = document.createElement("div");
                var category = menu.categories[i];
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
                    item_add_btn.innerHTML = '<button class="add_btn">+</button>';
                    item_div.appendChild(item_add_btn);
                    // name and price div  
                    var name_price_div = document.createElement("div");
                    name_price_div.className="name_price_div";
                    item_content.appendChild(name_price_div);
                    // item name        
                    var item_name = document.createElement("div");                 
                    item_name.className = "item_name";
                    item_name.innerHTML = category.menu_items[j].name;
                    name_price_div.appendChild(item_name);    
                    // item price  
                    var item_price = document.createElement("div");
                    item_price.className = "item_price";
                    item_price.innerHTML = category.menu_items[j].price + "₪";
                    name_price_div.appendChild(item_price);   
                    // item description                            
                    var item_description = document.createElement("div");
                    item_description.className = "item_description";
                    item_description.innerHTML = category.menu_items[j].description;
                    item_content.appendChild(item_description);
       
                }

            }
        }

    }
    xhr.send(nfc_code);
    
    var bottom_buttons = document.getElementById("button_bottom");
    // Get the offset position of the navbar
    var sticky = bottom_buttons.offsetBottom;

    // Add the sticky class to the buttons when you reach its scroll position. Remove "sticky" when you leave the scroll position
    function myFunction() {
      if (window.pageYOffset > sticky) {
        header.classList.add("sticky");
      } else {
        header.classList.remove("sticky");
      }
}

});