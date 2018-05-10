from pymongo import MongoClient
import os
import json
client=MongoClient("mongodb://" + os.getenv("mongo") + ":27017")
def handle(req):
   db=client.coffee_shop
   item=json.loads(req)
   count=0
   if len(item)>2:
       try:
           count=db.shopping_cart.count({"user_id":item["user_id"]})
           if int(count)>0 :
               product={
                   'product_name':item["product_name"],
                   'product_desc':item["product_desc"],
                   'product_price':int(item["product_price"])
                   }
               try:
                   db.shopping_cart.update({'user_id':item["user_id"]},{'$push':{'products':product},'$inc': { 'total_quantity': 1, 'total_price': int(item["product_price"])}})
                   return json.dumps({'msg':'product added to existing shopping_cart',"code":200})
               except :
                   return json.dumps({'msg':'something went wrong with just adding a new product',"code":400})
           else:
               cart={
                   'user_id':item["user_id"],
                   'total_price':int(item["product_price"]),
                   'total_quantity':1,
                   'products':[
                       {
                           'product_name':item["product_name"],
                           'product_desc':item["product_desc"],
                           'product_price':int(item["product_price"])
                       }
                   ]
               }
               try:
                   db.shopping_cart.insert_one(cart)
                   return json.dumps({'msg':'product added, created new cart',"code":200})
               except :
                   return json.dumps({'msg':'something with went wrong with adding item and creating new cart',"code":400})
       except :
           return json.dumps({'msg':'something went wrong with count of user id',"code":400})
   
   elif item["type"]=="get":
       products=[]
       try:
           cart=db.shopping_cart.find_one({'user_id':item['user_id']},{'_id':0})
           for product in cart["products"]:
               products.append(product)
           return json.dumps({"user_id":cart["user_id"],"total_price":cart["total_price"],"total_quantity":cart["total_quantity"],"products":products})
       except:
           return json.dumps({'msg':'something went wrong with the cart | no cart present',"code":400})

   elif item["type"]=="delete":
       try:
           db.shopping_cart.remove({'user_id':item["user_id"]})
           return json.dumps({'msg':'deleted',"code":200})
       except:
           return json.dumps({'msg':'something went wrong with deleting the shopping cart',"code":400})