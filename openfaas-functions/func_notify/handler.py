import twilio
import twilio.rest
import json
import os
from pymongo import MongoClient
from bson.objectid import ObjectId

client=MongoClient("mongodb://" + os.getenv("mongo") + ":27017")
def handle(req):
	global client
	db=client.coffee_shop
	resp="Your order for items: "
	order=json.loads(req)
	user=order["user_id"]
	#print(user)
	#print(type(ObjectId(user)))
	try:
		userdata=db.users.find_one({"_id":ObjectId(user)},{"_id":0})
		#print(json.dumps(userdata))
		number=userdata["number"]
	except:
		return json.dumps({"msg":"invalid user id"})

	for product in order["products"]:
		resp=resp+str(product["product_name"])+", "

	resp=resp+"is placed for a price of "+str(order["total_price"])
	try:
		client = twilio.rest.TwilioRestClient(str(os.getenv("account_sid")), str(os.getenv("auth_token")))
		message = client.messages.create(
			body=resp,
			to=str(number),
			from_="+17014012127"
		)
		return json.dumps({"msg":"success"})
	except twilio.TwilioRestException as e:
		return json.dumps({"msg":"error"})
