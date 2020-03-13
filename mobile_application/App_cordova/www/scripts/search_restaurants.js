document.addEventListener("DOMContentLoaded", function (event) {
    document.getElementById("searchButton").addEventListener("click",
        function (event) {
            var serch_key = document.getElementById("searchTerm").value;
            window.location.href = "search_resaults_restaurants.html?search_key=" + serch_key;
        });

});

