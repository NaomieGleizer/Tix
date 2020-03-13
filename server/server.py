import mysql.connector
import json

from flask import Flask, redirect, url_for, request
from flask_cors import CORS, cross_origin
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    passwd="mysqlbgnh123",
    auth_plugin='mysql_native_password',
    database="Restaurents"
)

mycursor = mydb.cursor()

db_names = ["id", "name", "address_street", "address_city", "owner_name", "email", "phone_number", "menu"]


@app.route('/add_restaurant',methods=['POST'])
def add_restaurant():
    restaurant_name = request.form['rname']
    address_street = request.form['street']
    address_city = request.form['city']
    owner_name = request.form['owner_name']
    email = request.form['email']
    phone_number = request.form['phone']
    menu = request.files['menu'].read()

    sql = "INSERT INTO restaurant_details (name, address_street, address_city, owner_name, email, phone_number, menu)" \
          " VALUES ( %s, %s, %s, %s, %s, %s, %s)"
    val = (restaurant_name, address_street, address_city, owner_name, email, phone_number, menu)
    mycursor.execute(sql, val)
    mydb.commit()
    return "Restaurant added successfully"


@app.route('/get_restaurants', methods=['GET'])
def get_restaurant():
    mycursor.execute("SELECT * FROM restaurant_details")
    myresult = mycursor.fetchall()
    return json.dumps(myresult)


@app.route('/identify_restaurant_nfc', methods=['GET'])
@cross_origin(origin="*")
def identify_restaurant_nfc():
    mycursor.execute("SELECT name, menu FROM restaurant_details WHERE id=6")
    myresult = mycursor.fetchall()
    keys=["name", "menu"]
    dictionary = dict(zip(keys, myresult[0]))
    return json.dumps(dictionary)


@app.route('/restaurants_search', methods=['GET'])
@cross_origin(origin="*")
def restaurants_search():
    search_key= request.args.get("search_key")
    if not search_key:
        mycursor.execute("select name, menu, address_street, address_city, phone_number from restaurant_details")
        myresult = mycursor.fetchall()
        keys=["name", "menu", "address_street", "address_city"]
        dictionary = [dict(zip(keys, i)) for i in myresult]
        return json.dumps(dictionary)

    execute = "SELECT name, menu, address_street, address_city, phone_number FROM restaurant_details WHERE name='" \
             + search_key + "' OR address_city='" + search_key + "'"
    mycursor.execute(execute)
    myresult = mycursor.fetchall()
    keys=["name", "menu", "address_street", "address_city"]
    dictionary = [dict(zip(keys, i)) for i in myresult]
    return json.dumps(dictionary)

if __name__ == '__main__':
   app.run(debug = True)

