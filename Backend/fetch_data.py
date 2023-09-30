from pymongo import MongoClient
from flask import Flask, jsonify
from pymongo.server_api import ServerApi
from flask_cors import CORS
import certifi

app = Flask(__name__)
CORS(app)

# Set Up MongoDB Connection
connection_string = "mongodb+srv://shahprasham8052:Nexus1973@cluster0.nriwqlg.mongodb.net/Assignment?retryWrites=true&w=majority"

# Initialize the MongoClient with the connection string
client = MongoClient(connection_string, server_api=ServerApi('1'), tlsCAFile=certifi.where())

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print("OOPS !, Sorry we cannot connect you to MongoDB!")
    print(e)

# Specify the database and collection
db = client["Assignment"]  
collection = db["Products"]  

@app.route('/')
def hello_world():
	return 'Hello, Healiom!'

@app.route('/api/data', methods=['GET'])
def get_data():
    data = list(collection.find({}, {'_id': 0}))
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True,port=5000)
