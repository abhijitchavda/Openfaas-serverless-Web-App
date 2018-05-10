import os
import json
from pymongo import MongoClient
# from bson import BSON
# from bson import json_util

url = "mongodb://" + os.getenv("mongo") + ":27017"
client = MongoClient(url)

def handle(req):
   """handle a request to the function
   Args:
       req (str): request body
   """
   db = client.coffee_shop
   try:
       result=db.coffee_collection.find({},{'_id':0})
       lis=[]
       for item in result:
           lis.append(item)
       return json.dumps({"products":lis})
   except:
        return json.dumps({'err':'something went wrong with the product catalog | no catalog available'})