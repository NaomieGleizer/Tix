document.addEventListener("DOMContentLoaded", function (event) {
    meals = JSON.parse(sessionStorage.getItem("client_order_meals"));
    document.getElementById("rest_name").innerHTML = sessionStorage.getItem("restaurant_name");;
    var i;
    var total_price = 0;
    text = "";
    // create a table with order items 
    for (var meal in meals) {
        text += '<tr> <td width="80%">' + meal + " " + String(meals[meal][1]) + "x" + "</td>" +
            '<td width="20%">' + String(meals[meal][0]) + "</td>  </tr>"
        total_price += meals[meal][0];
    }
    text += "<p/>";
    document.getElementById("order_items").innerHTML = text;
    document.getElementById("total_price").innerHTML = "סכום כולל: " + String(total_price);

    // add onclick events to buttons
    //document.getElementById("my_order")
      //  .addEventListener("click", show_my_order);

  

});