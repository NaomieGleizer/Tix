document.addEventListener("DOMContentLoaded", function (event) {
    var last_order_details = JSON.parse(sessionStorage.getItem("last_order"));
    var meals = JSON.parse(last_order_details["order"]);
    var date = last_order_details["date"];
    var rest_name = last_order_details["rest_name"];

    document.getElementById("rest_name").innerHTML = rest_name;
    document.getElementById("date").innerHTML = date;

    // create table for purchase summary
    var tr_title = document.createElement("TR");
    tr_title.setAttribute("id", "titles");
    document.getElementById("order_items").appendChild(tr_title);
    // titles
    var th1 = document.createElement("TH");
    th1.style.width = '60%';
    var text = document.createTextNode("פריט");
    th1.appendChild(text);
    document.getElementById("titles").appendChild(th1);
    var th2 = document.createElement("TH");
    th2.style.width = '20%';
    text = document.createTextNode("כמות");
    th2.appendChild(text);
    document.getElementById("titles").appendChild(th2);
    var th3 = document.createElement("TH");
    th3.style.width = '20%';
    text = document.createTextNode("מחיר");
    th3.appendChild(text);
    document.getElementById("titles").appendChild(th3);
    var i;
    var total_price = 0;
    var id = 0;
    // create a table with order items 
    for (var meal in meals) {
        for (i in meals[meal]) {
            var tr = document.createElement("TR");
            tr.setAttribute("id", "item" + String(id));
            document.getElementById("order_items").appendChild(tr);
            var td_meal = document.createElement("TD");
            // meal name
            td_meal.setAttribute("id", "meal" + String(id));
            td_meal.style.width = '60%';
            text = document.createTextNode(meal);
            td_meal.appendChild(text);
            var comments = "";
            // if there is size to meal, add to comments 
            if (meals[meal][i][3]) {
                comments += String(meals[meal][i][3]);
            }
            // if there is choice to meal, add to comments 
            if (meals[meal][i][4]) {
                if (comments !== "") {
                    comments += ", "
                }
                comments += "עם " + String(meals[meal][i][4]);
            }
            // if there are comments, add to table
            if (comments !== "") {
                var linebreak = document.createElement("br");
                td_meal.appendChild(linebreak);
                var comments_text = document.createTextNode(comments);
                var span = document.createElement('span');
                span.style.fontSize = "12px";
                span.appendChild(comments_text);
                td_meal.appendChild(span);
            }
            document.getElementById("item" + String(id)).appendChild(td_meal);
            // amount
            var td_amount = document.createElement("TD");
            td_amount.style.width = '20%';
            var text1 = document.createTextNode(String(meals[meal][i][1]));
            td_amount.appendChild(text1);
            document.getElementById("item" + String(id)).appendChild(td_amount);
            // price
            var td_price = document.createElement("TD");
            td_price.setAttribute("id", "price" + String(id));
            td_price.style.width = '20%';
            var text2 = document.createTextNode(String(meals[meal][i][0]) + "₪");
            td_price.appendChild(text2);
            document.getElementById("item" + String(id)).appendChild(td_price);
            // update total price
            total_price += parseFloat(meals[meal][i][0]);
            id += 1;
        }
    }
    document.getElementById("total_price").innerHTML = "סכום כולל: " + String(total_price) + "₪";
});