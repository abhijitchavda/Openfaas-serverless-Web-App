.PHONY: build

build:
	./build.sh
build-gateway:
	(cd gateway; ./build.sh latest-dev)

service-mongo-product-catalog:
	docker service create --network=func_functions --name coffeeshop-db-mongodb --publish 27017:27017 mongo mongod

service-mongo-shopping-cart:
	docker service create --network=func_functions --name cart-db-mongodb --publish 27018:27017 mongo mongod

service-mongo-orders:
	docker service create --network=func_functions --name orders-db-mongodb --publish 27019:27017 mongo mongod
	
service-mongo-users:
	docker service create --network=func_functions --name user-db-mongodb --publish 27020:27017 mongo mongod

build-product-catalog:
	faas-cli build -f pymongodb-function.yml
	faas-cli build -f func_get-product-catalog-from-mongodb.yml
	faas-cli build -f func_search-by-category.yml
	faas-cli build -f func_get_product_details.yml

build-shopping-cart:
	faas-cli build -f func_shopping_cart_micro.yml
	faas-cli build -f func_check_out_micro.yml
	faas-cli build -f func_notify.yml

deploy-product-catalog:
	faas-cli deploy -f pymongodb-function.yml
	faas-cli deploy -f func_get-product-catalog-from-mongodb.yml
	faas-cli deploy -f func_search-by-category.yml
	faas-cli deploy -f func_get_product_details.yml

deploy-shopping-cart:
	faas-cli deploy -f func_shopping_cart_micro.yml
	faas-cli deploy -f func_check_out_micro.yml
	faas-cli deploy -f func_notify.yml

# watchdog-func_notify:
# 	docker service ls
# 	docker service logs v5x6okhfeh6c
# openfaas---
# docker swarm init
# ./deploy_stack.sh
# faas template pull https://github.com/openfaas-incubator/python-flask-template
# faas-cli new --lang python3 hello-openfaas --prefix="<your-docker-username-here>"
# $ docker service create --network=func_functions --name coffeeshop-db-mongodb --publish 27017:27017 mongo mongod
# faas-cli build -f <name.yml>
# faas-cli push -f <name.yml>
# faas-cli deploy -f <name.yml>
# --------------------------------------------
# deploy the system
# docker swarm init
# ./deploy_stack.sh
# docker service create --network=func_functions --name cart-db-mongodb --publish 27018:27017 mongo mongod
# docker service create --network=func_functions --name orders-db-mongodb --publish 27019:27017 mongo mongod
# docker service create --network=func_functions --name user-db-mongodb --publish 27020:27017 mongo mongod
# faas-cli build -f func_shopping_cart_micro.yml
# faas-cli deploy -f func_shopping_cart_micro.yml
# faas-cli build -f func_check_out_micro.yml
# faas-cli deploy -f func_check_out_micro.yml
# faas-cli build -f func_notify_micro.yml
# faas-cli deploy -f func_notify_micro.yml
# flow--
# front
#     user goes through product catalog -- get request-- no parameters 
# back
#     get complete products and return it to the front end
# front
#     user searches products based on catagories -- {"catagory":"xyz"}
# back
#     take catagory as an input and return list of products for that catagory
# front
#     user clicks buy button -- 
#     {
#     "user_id":"2345",
#     "product_name":"mocha",
#     "product_desc":"awesome blend",
#     "product_price":34
#     } 
# back
#     take user id and product data and store it to shopping cart db
# front
#     show user that product was added
# front
#     user clicks on shopping cart -- {"user_id":"xyz"}
# back
#     pass the user id and get the list of all the items in shopping cart
# front
#     user clicks check out --
#     {
#     "user_id": "2345",
#     "total_price": 136,
#     "total_quantity": 4,
#     "products": [
#         {
#             "product_name": "mocha",
#             "product_desc": "awesome blend",
#             "product_price": 34
#         },
#         {
#             "product_name": "mocha",
#             "product_desc": "awesome blend",
#             "product_price": 34
#         },
#         {
#             "product_name": "mocha",
#             "product_desc": "awesome blend",
#             "product_price": 34
#         },
#         {
#             "product_name": "mocha",
#             "product_desc": "awesome blend",
#             "product_price": 34
#         }
#     ]
#     }
# back
#     take the cart details and add it to orders placed with user id and send a notification
# front
#     when receive a positive response call shopping cart delete Api -- {"user_id":"xyz"}
# back
#     delete that shopping cart
# front
#     after delete positive response.. show order has been placed successfully

