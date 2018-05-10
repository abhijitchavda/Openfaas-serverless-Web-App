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
   item = json.loads(req)
   try:
       result=db.coffee_collection.find({'category':item['category']},{'_id':0})
       lis=[]
       for item in result:
           lis.append(item)
       return json.dumps({"products":lis})
   except:
       return json.dumps({'err':'invalid product category | no such category is available', 'code':400})