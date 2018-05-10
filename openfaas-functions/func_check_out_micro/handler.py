from pymongo import MongoClient
import os
import json
import requests
import datetime
client=MongoClient("mongodb://" + os.getenv("mongo") + ":27017")
def handle(req):
    order=json.loads(req)
    try:
        db=client.coffee_shop
    except:
        return json.dumps({'msg':'unable to connect'})
    
    if len(order)>1:    
        try:
            products=[]
            for product in order["products"]:
                products.append(product)
            now = datetime.datetime.now()
            odr={
                'date':str(now.date()),
                'user_id':order["user_id"],
                'total_price':order["total_price"],
                'total_quantity':order["total_quantity"],
                'products':products
            }
            db.orders.insert_one(odr)
            odr={
                'user_id':order["user_id"],
                'total_price':order["total_price"],
                'total_quantity':order["total_quantity"],
                'products':products
            }
            return json.dumps({'msg':'success','status':'order placed','details':odr,'code':200}) 
        except:
            return json.dumps({'msg':'unable to store orders','code':500})
    else:
        try:
            dic={}
            results=[]
            odr=db.orders.find({"user_id":order["user_id"]},{"_id":0})
            for ordr in odr:
                dic={"date":ordr["date"],"total_price":ordr["total_price"],"products":ordr["products"]}
                results.append(dic)
            return json.dumps({"msg":"success","user_id":order["user_id"],"orders":results,'code':200})
        except:
            return json.dumps({"msg":"error in getting orders|no order found",'code':404})