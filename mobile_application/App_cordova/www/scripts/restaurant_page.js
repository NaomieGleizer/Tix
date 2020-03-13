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
            var table = document.getElementById("menu_table");
            var index_row = 0;
            for (i in menu.categories) {
                console.log(i);
                var category = menu.categories[i];
                var row = table.insertRow(index_row);
                index_row += 1;
                var cell = row.insertCell(0);
                cell.className = "category_name";
                cell.colSpan = 4;
                cell.innerHTML = category.name;

                for (j in category.menu_items) {
                    var row = table.insertRow(index_row);
                    index_row += 1;
                    var cell = row.insertCell(0);
                    cell.className = "item_name";
                    cell.innerHTML = category.menu_items[j].name;
                    cell = row.insertCell(1);
                    cell.className = "item_description";
                    cell.innerHTML = category.menu_items[j].description;
                    cell = row.insertCell(2);
                    cell.className = "item_price";
                    cell.innerHTML = category.menu_items[j].price + "₪";
                    cell = row.insertCell(3);
                    cell.innerHTML = '<button class="add">+</button>';
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