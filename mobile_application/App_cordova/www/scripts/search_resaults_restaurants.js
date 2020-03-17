document.addEventListener("DOMContentLoaded", function (event) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const search_key = urlParams.get('search_key');

    var xhr = new XMLHttpRequest();
    url = "http://127.0.0.1:5000/restaurants_search?search_key=" + search_key;
    xhr.open("GET", url, true);
    // sevrver returns an answer 
    xhr.onreadystatechange = function () {
        // if server accepted request, alert and return to index page
        if (xhr.readyState === 4 && xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            console.log(data);
            var resaults = document.getElementById("resaults");
            // found resaults number
            var num_of_items_found = document.createElement("div");
            num_of_items_found.className = "items_found";
            num_of_items_found.innerHTML= "נמצאו " + data.length + " תוצאות חיפוש";
            resaults.appendChild(num_of_items_found);
            for (i in data){

                // add row
                var row = document.createElement("div");
                row.className = "row";
                resaults.appendChild(row);
                
                var restaurant_box_wrapper = document.createElement("a");
                row.appendChild(restaurant_box_wrapper);

                var restaurant_details_wrapper = document.createElement("div");
                restaurant_details_wrapper.className = "restaurant_details_wrapper";
                restaurant_box_wrapper.appendChild(restaurant_details_wrapper);

                var restaurant_name_div = document.createElement("div");
                restaurant_name_div.className = "restaurant_name_div";
                var restaurant_name = data[i].restaurant_name;
                restaurant_name_div.innerHTML = restaurant_name;
                restaurant_details_wrapper.appendChild(restaurant_name_div);
                
                var restaurant_type_div = document.createElement("div");
                restaurant_type_div.className = "restaurant_type_div";
                var type = data[i].type;
                restaurant_type_div.innerHTML = type;
                restaurant_details_wrapper.appendChild(restaurant_type_div);
                
                var restaurant_address_div = document.createElement("div");
                restaurant_address_div.className = "restaurant_address_div";
                var restaurant_address = data[i].address_street + " " + data[i].address_city;
                restaurant_address_div.innerHTML = restaurant_address;
                restaurant_details_wrapper.appendChild(restaurant_address_div);  

                var restaurant_phone_div = document.createElement("div");
                restaurant_phone_div.className = "restaurant_phone_div";
                var phone = data[i].phone_number;
                restaurant_phone_div.innerHTML = phone;
                restaurant_details_wrapper.appendChild(restaurant_phone_div);
                  
                var strJSON = encodeURIComponent(JSON.stringify(data[i].categories));
                restaurant_box_wrapper.href = "restaurant_page.html?name=" + restaurant_name + "&address="
                + restaurant_address + "&phone=" + phone + "&menu=" + strJSON;
                
            }
            

        }
    }
    xhr.send();

    document.getElementById("searchButton").addEventListener("click",
        function (event) {
            var serch_key = document.getElementById("searchTerm").value;
            window.location.href = "search_resaults_restaurants.html?search_key=" + serch_key;
        });

});