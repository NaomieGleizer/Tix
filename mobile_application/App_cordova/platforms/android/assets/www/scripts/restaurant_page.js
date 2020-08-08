document.addEventListener("DOMContentLoaded", function (event) {
    const restaurant_name = JSON.parse(sessionStorage.getItem("restaurant_name"));
    const restaurant_address = JSON.parse(sessionStorage.getItem("restaurant_address"));
    const restaurant_phone = JSON.parse(sessionStorage.getItem("restaurant_phone"));
    const restaurant_menu = JSON.parse(sessionStorage.getItem("restaurant_menu"));

    var restaurant_name_div = document.getElementById("restaurant_name");
    restaurant_name_div.innerHTML = restaurant_name;

    var restaurant_address_div = document.getElementById("restaurant_address");
    restaurant_address_div.innerHTML = restaurant_address;

    var restaurant_phone_div = document.getElementById("restaurant_phone");
    restaurant_phone_div.innerHTML = restaurant_phone;

    show_menu(restaurant_menu);

    //var menu_div = document.getElementById("menu");
    //for (i in restaurant_menu) {
    //    var category_div = document.createElement("div");
    //    var category = restaurant_menu[i];
    //    category_div.className = "category_name";
    //    category_div.innerHTML = category.name;
    //    menu_div.appendChild(category_div);

    //    for (j in category.menu_items) {

    //        // item content div - contains name, price and description
    //        var item_content = document.createElement("div");
    //        item_content.className = "item_content";
    //        menu_div.appendChild(item_content);
            
    //        // name and price div  
    //        var name_price_div = document.createElement("div");
    //        name_price_div.className = "name_price_div";
    //        item_content.appendChild(name_price_div);
    //        // item name        
    //        var item_name = document.createElement("div");
    //        item_name.className = "item_name";
    //        item_name.innerHTML = category.menu_items[j].item_name;
    //        name_price_div.appendChild(item_name);
    //        // item price  
    //        var item_price = document.createElement("div");
    //        item_price.className = "item_price";
    //        item_price.innerHTML = category.menu_items[j].item_price + "₪";
    //        name_price_div.appendChild(item_price);
    //        // item description                            
    //        var item_description = document.createElement("div");
    //        item_description.className = "item_description";
    //        item_description.innerHTML = category.menu_items[j].item_description;
    //        item_content.appendChild(item_description);

    //    }

    //}



    document.getElementById("searchButton").addEventListener("click",
        function (event) {
            var serch_key = document.getElementById("searchTerm").value;
            window.location.href = "search_resaults_restaurants.html?search_key=" + serch_key;
        });

});


function show_menu(restaurant_menu) {
    var table_menu = document.createElement("table");
    // go over categories in menu 
    for (i in restaurant_menu) {
        var category = restaurant_menu[i];
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
            td_meal.style.width = '61%';
            td_meal.setAttribute("class", "item_name");
            var name_span = document.createElement("span");
            name_span.style.cssFloat = "right";
            name_span.appendChild(document.createTextNode(category.menu_items[j].item_name));
            td_meal.appendChild(name_span);
            // if meal has a feature, add it to menu and save 
            if (category.menu_items[j].item_features) {
                features = (category.menu_items[j].item_features);
                more_than_one_feature = false;
                // else if meal is vegan, add vegan
                if (features.includes("מנה טבעונית")) {
                    var vegan_img = document.createElement("IMG");
                    vegan_img.setAttribute("class", "first_feature");
                    vegan_img.setAttribute("src", "images/vegan.png");
                    td_meal.appendChild(vegan_img);
                    more_than_one_feature = true;
                    meal_tr.classList.add("vegan_class");
                }
                // if meal is vegi, add vegi
                else if (features.includes("מנה צמחונית")) {
                    // adding vegi image
                    var vegi_img = document.createElement("IMG");
                    vegi_img.setAttribute("class", "first_feature");
                    vegi_img.setAttribute("src", "images/vegi.png");
                    td_meal.appendChild(vegi_img);
                    more_than_one_feature = true;
                    //meal_tr.setAttribute("class", "vegi_class");
                    meal_tr.classList.add("vegi_class");
                }
                // if meal is gluten free, add gluten free 
                if (features.includes("מנה ללא גלוטן")) {
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
                    meal_tr.classList.add("gluten_free_class");
                }
            }
            else {
                meal_tr.setAttribute("class", "no_feature_class");
            }
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
           
            span = document.createElement('span');
            span.style.textAlign = "left";
            span.appendChild(document.createTextNode(category.menu_items[j].item_price + "₪"));
            td_price.appendChild(span);
            meal_tr.appendChild(td_price);
            // adding meal image
            var td_image = document.createElement("td");
            td_image.style.width = '17%';
            var meal_img = document.createElement("IMG");
            meal_img.setAttribute("class", "meal_img");
            meal_img.setAttribute("src", "images/shakshuka.png");
            td_image.appendChild(meal_img);
            meal_tr.appendChild(td_image);
            table_menu.appendChild(meal_tr);
        }
    }
    document.getElementById("menu").appendChild(table_menu);
}