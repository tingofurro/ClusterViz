from pymongo import MongoClient, errors

client = MongoClient('mongodb://127.0.0.1:27017/')
db = client['news']