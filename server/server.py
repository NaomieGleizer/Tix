import mysql.connector
import json
from flask import Flask, request
from flask_cors import CORS, cross_origin
from flask_socketio import SocketIO, emit, join_room


app = Flask(__name__)
# app.run(debug = True)
app.config['CORS_HEADERS'] = 'Content-Type'
CORS(app)
socketio = SocketIO(app)


########### MYSQL CONNECTION ############
def connect_to_mysql():
    mydb = mysql.connector.connect(
        host="naomiegleizer.mysql.pythonanywhere-services.com",
        user="naomiegleizer",
        passwd="mysqlbgnh123",
        auth_plugin='mysql_native_password',
        database="naomiegleizer$Tix_db"
    )
    mycursor = mydb.cursor(dictionary=True)
    return (mydb, mycursor)

print("after db connection")
#########################################

item_id =0

# called from desktop app. add a restaurant to the db.
@app.route('/add_restaurant', methods=['POST'])
@cross_origin()
def add_restaurant():

    mydb, mycursor = connect_to_mysql()
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
              ", owner_email, owner_phone)" " VALUES ( %s, %s, %s, %s, %s, %s, %s, %s)"
    val = (
    restaurant_name, restaurant_type, address_street, address_city, phone_number, owner_name, owner_email, owner_phone)
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
            command = "INSERT INTO menu_items (item_name, item_price, category_id)" "VALUES (%s, %s, %s)"
            item_name = item['name']
            item_price = item['price']
            val = (item_name, item_price, category_id)
            mycursor.execute(command, val)
            mydb.commit()
            # test#
            global item_id
            item_id = str(mycursor.lastrowid)
            if 'description' in item:
                item_description = item['description']
                command = "UPDATE menu_items SET item_description ='" + item_description + "' WHERE id = '" + item_id + "'"
                mycursor.execute(command)
                mydb.commit()
            if 'sizes' in item:
                item_sizes = item['sizes']
                command = "UPDATE menu_items SET item_sizes ='" + item_sizes + "' WHERE id = '" + item_id + "'"
                mycursor.execute(command)
                mydb.commit()
            if 'choices' in item:
                item_choices = item['choices']
                command = "UPDATE menu_items SET item_choices ='" + item_choices + "' WHERE id = '" + item_id + "'"
                mycursor.execute(command)
                mydb.commit()

    mydb.close()
    return "Restaurant added successfully"


# called from desktop app. get all restaurants.
@app.route('/get_restaurants', methods=['GET'])
@cross_origin()
def get_restaurant():
    mydb, mycursor = connect_to_mysql()
    mycursor.execute("SELECT * FROM Restaurant")
    myresult = mycursor.fetchall()
    mydb.close()
    return json.dumps(myresult)


@app.route('/hello', methods=['GET', 'POST', 'OPTIONS'])
def hello():
    print("identify")
    return "hello2"


# called from mobile app, return restaurant's name and menu by nfc code.
@app.route('/identify_restaurant_nfc', methods=['GET', 'POST', 'OPTIONS'])
# @cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
@cross_origin()
def identify_restaurant_nfc():
    # get restaurant
    ##change id for test!!
    mydb, mycursor = connect_to_mysql()
    mycursor.execute("SELECT id, name FROM Restaurant WHERE id=5")
    restaurant = mycursor.fetchall()[0]
    mydb.close()
    dict_restaurant = dict_of_restauran_menu(restaurant['id'], False)
    dict_restaurant['restaurant_name'] = restaurant['name']
    return json.dumps(dict_restaurant)


# called from mobile app, search page, return restaurant with the given key search
@app.route('/restaurants_search', methods=['GET'])
@cross_origin()
def restaurants_search():
    mydb, mycursor = connect_to_mysql()
    search_key = request.args.get("search_key")
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
        restaurant_dict = dict_of_restauran_menu(restaurant['id'], False)
        restaurant_dict['restaurant_name']=restaurant['name']
        restaurant_dict["type"] = restaurant['type']
        restaurant_dict["address_street"] = restaurant['address_street']
        restaurant_dict["address_city"] = restaurant['address_city']
        restaurant_dict["phone_number"] = restaurant['phone_number']
        restaurants.append(restaurant_dict)
        mydb.close()
    return json.dumps(restaurants)


# restaurant side connection, returns id and name of restaurant
@app.route('/restaurant_side_connection', methods=['GET','POST'])
@cross_origin()
def restaurant_side_connection():
    # get restaurant
    ##change id for test!!
    mydb, mycursor = connect_to_mysql()
    mycursor.execute("SELECT id, name FROM Restaurant WHERE id=5")
    myresult = mycursor.fetchall()
    mydb.close()
    return json.dumps(myresult[0])


# restaurant side, get address, menu
@app.route('/restaurant_side_get_details', methods=['GET','POST'])
@cross_origin()
def restaurant_side_get_details():
    restaurant_id = request.args.get("restaurant_id")
    mydb, mycursor = connect_to_mysql()
    mycursor.execute("SELECT address_street, address_city, phone_number FROM Restaurant WHERE id=" + restaurant_id)
    restaurant = mycursor.fetchall()[0]
    mydb.close()
    dict_restaurant = dict_of_restauran_menu(restaurant_id, True)
    dict_restaurant['address_street']=restaurant['address_street']
    dict_restaurant['address_city']=restaurant['address_city']
    dict_restaurant['phone_number']=restaurant['phone_number']
    return json.dumps(dict_restaurant)


# restaurant side, update details
@app.route('/restaurant_side_update_details', methods=['GET','POST'])
@cross_origin()
def restaurant_side_update_details():
    new_details = request.get_json()
    mydb, mycursor = connect_to_mysql()
    if "details_changes" in new_details:
        restaurant_id = request.args.get("restaurant_id")
        details = new_details["details_changes"]
        for detail in details:
            mycursor.execute("UPDATE Restaurant SET " + detail +"='" + details[detail] + "' WHERE id =" + restaurant_id)
            mydb.commit()
    if "menu_items_changes" in new_details:
        new_items = new_details["menu_items_changes"]
        for item in new_items:
            mycursor.execute("UPDATE menu_items SET " + new_items[item][0] +"='" + new_items[item][1] + "' WHERE id =" + item)
            mydb.commit()
    if "menu_items_added" in new_details:
        new_items = new_details["menu_items_added"]
         # list of items
        for item in new_items:
            item_name = item['item_name']
            item_price = item['item_price']
            category_id = item['category_id']
            command = "INSERT INTO menu_items (item_name, item_price, category_id)" "VALUES (%s, %s, %s)"
            val = (item_name, item_price, category_id)
            mycursor.execute(command, val)
            mydb.commit()
            item_id = str(mycursor.lastrowid)
            if 'item_description' in item:
                item_description = item['item_description']
                command = "UPDATE menu_items SET item_description ='" + item_description + "' WHERE id = '" + item_id + "'"
                mycursor.execute(command)
                mydb.commit()
    mydb.close()
    return "restaurant updated successfully"


# # restaurant side, update menu
# @app.route('/restaurant_side_update_menu', methods=['GET','POST'])
# @cross_origin()
# def restaurant_side_update_menu():
#     new_items = request.get_json()
#     mydb, mycursor = connect_to_mysql()

#     mydb.close()
#     return "restaurant updated successfully"


# # restaurant side, add items to menu
# @app.route('/restaurant_side_add_items_to_menu', methods=['GET','POST'])
# @cross_origin()
# def restaurant_side_add_items_to_menu():
#     new_items = request.get_json()
#     mydb, mycursor = connect_to_mysql()


#     mydb.close()
#     return "restaurant updated successfully"


def dict_of_restauran_menu(restaurant_id, flag_get_id__item_category):
    mydb, mycursor = connect_to_mysql()
    dict = {}
    categories = []
    # get categories
    mycursor.execute("SELECT id, category_name FROM categories WHERE restaurant_id=" + str(restaurant_id))
    myresult = mycursor.fetchall()
    for category in myresult:
        category_dict = {}
        category_id = category['id']
        category_name = category['category_name']
        category_dict['name'] = category_name
        # get items
        if flag_get_id__item_category:
            category_dict['id'] = category_id
            mycursor.execute(
                "SELECT id, item_name, item_description, item_sizes, item_choices, item_price FROM menu_items WHERE category_id=" + str(category_id))
        else:
            mycursor.execute(
                "SELECT item_name, item_description, item_sizes, item_choices, item_price FROM menu_items WHERE category_id=" + str(category_id))
        myresult = mycursor.fetchall()
        category_dict['menu_items'] = myresult
        categories.append(category_dict)
    dict['categories'] = categories
    mydb.close()
    return dict

restaurants_clients = {}
@socketio.on('join_connection')
def join_connection(msg):
    restaurants_clients[msg['id']] = request.sid
    print(restaurants_clients)
    room = msg['room']
    join_room(room)

@socketio.on('new_order')
def new_order(order):
    print ("hi")

if __name__ == '__main__':
   app.run(debug = True)
