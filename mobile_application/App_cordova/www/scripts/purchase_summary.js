document.addEventListener("DOMContentLoaded", function (event) {
    meals = JSON.parse(sessionStorage.getItem("client_order_meals"));
    document.getElementById("rest_name").innerHTML = sessionStorage.getItem("restaurant_name");


    var tr_title = document.createElement("TR");
    tr_title.setAttribute("id", "titles");
    document.getElementById("order_items").appendChild(tr_title);

    var th1 = document.createElement("TH");
    th1.style.width = '60%';
    var text = document.createTextNode("פריט");
    th1.appendChild(text);
    document.getElementById("titles").appendChild(th1);

    var th2 = document.createElement("TH");
    th2.style.width = '20%';
    var text = document.createTextNode("כמות");
    th2.appendChild(text);
    document.getElementById("titles").appendChild(th2);

    var th3 = document.createElement("TH");
    th3.style.width = '20%';
    var text = document.createTextNode("מחיר");
    th3.appendChild(text);
    document.getElementById("titles").appendChild(th3);


    var i;
    var total_price = 0;
    var id = 0;
    // create a table with order items 
    for (var meal in meals) {
       


        var tr = document.createElement("TR");
        tr.setAttribute("id", "item" + String(id));
        document.getElementById("order_items").appendChild(tr);
        var td = document.createElement("TD");
        td.setAttribute("id", "meal" + String(id));
        td.style.width = '60%';
        var text = document.createTextNode(meal);
        td.appendChild(text);
        document.getElementById("item" + String(id)).appendChild(td);

        var td1 = document.createElement("TD");
        td1.style.width = '20%';
        var text1 = document.createTextNode(String(meals[meal][1]));
        td1.appendChild(text1);
        document.getElementById("item" + String(id)).appendChild(td1);

        var td2 = document.createElement("TD");
        td2.setAttribute("id", "price" + String(id));
        td2.style.width = '20%';
        var text2 = document.createTextNode(String(meals[meal][0]));
        td2.appendChild(text2);
        document.getElementById("item" + String(id)).appendChild(td2);

        total_price += meals[meal][0];
        id += 1;
    }
    document.getElementById("total_price").innerHTML = "סכום כולל: " + String(total_price);
    sessionStorage.setItem("total_price", total_price);

    // add onclick events to buttons
    document.getElementById("edit_order")
        .addEventListener("click", edit_order);

    document.getElementById("paying")
        .addEventListener("click", paying);

});


// back to menu
function edit_order() {
    window.location.href = "restaurant_connection_page.html";
}

function paying() {
    window.location.href = "paying_form.html";
}

