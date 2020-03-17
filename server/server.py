import mysql.connector
import json

from flask import Flask, redirect, url_for, request
from flask_cors import CORS, cross_origin
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

mydb = mysql.connector.connect(
    host="sql7.freemysqlhosting.net",
    user="sql7328019",
    passwd="Vdm72IWFyD",
    auth_plugin='mysql_native_password',
    database="sql7328019"
)

mycursor = mydb.cursor(dictionary=True)

db_names = ["id", "name", "address_street", "address_city", "owner_name", "owner_email", "phone_number", "menu"]


@app.route('/add_restaurant',methods=['POST'])
def add_restaurant():
    # get data from form
    restaurant_name = request.form['rname']
    restaurant_type = request.form.get('select_type')
    address_street = request.form['street']
    address_city = request.form['city']
    owner_name = request.form['owner_name']
    owner_email = request.form['email']
    phone_number = request.form['phone']
    owner_phone = request.form['owner_phone']
    menu = json.loads(request.files['menu'].read().decode())

    # insert restaurant to table
    command = "INSERT INTO Restaurant (name, type, address_street, address_city, phone_number, owner_name" \
              ", owner_email, owner_phone)" " VALUES ( %s, %s, %s, %s, %s, %s, %s)"
    val = (restaurant_name, restaurant_type, address_street, address_city, phone_number, owner_name, owner_email, owner_phone)
    mycursor.execute(command, val)
    mydb.commit()
    restaurant_id = mycursor.lastrowid

    for category in menu['categories']:
        category_name = category['name']
        # insert category to table
        command = "INSERT INTO categories (category_name, restaurant_id)" "VALUES (%s, %s)"
        val = (category_name, restaurant_id)
        mycursor.execute(command, val)
        mydb.commit()
        category_id = mycursor.lastrowid
        # insert items to table
        menu_items = category['menu_items']
        for item in menu_items:
            command = "INSERT INTO menu_item (item_name, item_price, category_id)" "VALUES (%s, %s, %s)"
            item_name = item['name']
            item_price = item['price']
            val = (item_name, item_price, category_id)
            mycursor.execute(command, val)
            mydb.commit()
            if 'description' in item:
                item_description = item['description']
                command = "UPDATE menu_item SET item_description ='"+item_description+"' WHERE id = '" +str(mycursor.lastrowid) +"'"
                mycursor.execute(command)
                mydb.commit()


    return "Restaurant added successfully"


@app.route('/get_restaurants', methods=['GET'])
def get_restaurant():
    mycursor.execute("SELECT * FROM Restaurant")
    myresult = mycursor.fetchall()
    return json.dumps(myresult)

# mobile app, return restaurant name and menu by nfc code
@app.route('/identify_restaurant_nfc', methods=['GET'])
@cross_origin(origin="*")
def identify_restaurant_nfc():
    # get restaurant
    # change id for test!!
    mycursor.execute("SELECT id, name FROM Restaurant WHERE id=5")
    myresult = mycursor.fetchall()

    return json.dumps(dict_of_restaurant_name_menu(myresult[0]))


# mobile app, search page, return restaurant with the given key search
@app.route('/restaurants_search', methods=['GET'])
@cross_origin(origin="*")
def restaurants_search():
    search_key= request.args.get("search_key")
    # if key is empty, return all restaurants
    if not search_key:
        command = "select id, name, type, address_street, address_city, phone_number from Restaurant"
    # else, search restaurant with this name/city address/type
    else:
        command = "SELECT id, name, type, address_street, address_city, phone_number FROM Restaurant WHERE name='" \
             + search_key + "' OR address_city='" + search_key + "' OR type='" + search_key + "'"
    mycursor.execute(command)
    myresult = mycursor.fetchall()
    restaurants = []
    for restaurant in myresult:
        restaurant_dict = dict_of_restaurant_name_menu(restaurant)
        restaurant_dict["type"] = restaurant['type']
        restaurant_dict["address_street"] = restaurant['address_street']
        restaurant_dict["address_city"] = restaurant['address_city']
        restaurant_dict["phone_number"] = restaurant['phone_number']
        restaurants.append(restaurant_dict)
    return json.dumps(restaurants)

def dict_of_restaurant_name_menu(restaurant):
    restaurant_id = restaurant['id']
    restaurant_name = restaurant['name']
    dict = {'restaurant_name': restaurant_name}
    categories = []
    # get categories
    mycursor.execute("SELECT id, category_name FROM categories WHERE restaurant_id=" + str(restaurant_id))
    myresult = mycursor.fetchall()
    for category in myresult:
        category_dict = {}
        category_id = category['id']
        category_name = category['category_name']
        category_dict['name']= category_name
        # get items
        mycursor.execute("SELECT item_name, item_description, item_price FROM menu_item WHERE category_id=" + str(category_id))
        myresult = mycursor.fetchall()
        category_dict['menu_items'] = myresult
        categories.append(category_dict)
    dict['categories']= categories
    return dict

if __name__ == '__main__':
   app.run(debug = True)

