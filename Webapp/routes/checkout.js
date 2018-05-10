var express = require('express');
var router = express.Router();
var request = require('request');
var passport = require('passport');
var const_file=require('../public/javascripts/constants.js');
var ip="localhost:8080"//------------------>ip address with port
router.get('/', isLoggedIn, function(req,res, next){
    //place order
    var headers = {
        'User-Agent':       'Super Agent/0.0.1',
        'Content-Type':     'application/x-www-form-urlencoded'
    };

    var user = req.session.passport.user;
// Configure the request
    var options = {
        url: 'http://'+ip+'/function/func_shopping_cart_micro',
        method: 'POST',
        headers: headers,
        form: JSON.stringify({"user_id": user,"type":"get"})
    };

// Start the request for getting the shopping cart
    request(options, function (error, resp, body) {
        if (error) {
            throw error;
        }
        var data = JSON.parse(body);
        var cart=data;
        var headers = {
            'User-Agent':       'Super Agent/0.0.1',
            'Content-Type':     'application/x-www-form-urlencoded'
        };
        var place_orders={
            url: 'http://'+ip+'/function/func_check_out_micro',
            method: 'POST',
            headers: headers,
            form: JSON.stringify(data)
        };
        //start request to store pass the shopping cart to the orders backend
        request(place_orders, function (error, respo, body) {
            var data = JSON.parse(body)
            console.log("-------------------------")
            console.log(data)
            console.log("-------------------------")
            if(data.code==200){
                //order stored//send notification//delete from shopping cart
                var headers = {
                    'User-Agent':       'Super Agent/0.0.1',
                    'Content-Type':     'application/x-www-form-urlencoded'
                };
                var send_notification={
                    url: 'http://'+ip+'/function/func_notify',
                    method: 'POST',
                    headers: headers,
                    form: JSON.stringify(data.details)
                };
                //start request to send notification 
                request(send_notification, function (error, respon, body) {
                    console.log("******************");
                    console.log(body);
                    console.log("******************");
                    var data=JSON.parse(body); 
                    //console.log(data);
                    if(data.msg=="success"){
                        //delete shopping cart//then display the order
                        var headers = {
                            'User-Agent':       'Super Agent/0.0.1',
                            'Content-Type':     'application/x-www-form-urlencoded'
                        };
                        var delete_cartitems={
                            url: 'http://'+ip+'/function/func_shopping_cart_micro',
                            method: 'POST',
                            headers: headers,
                            form: JSON.stringify({"user_id": user,"type":"delete"})
                        };
                        //start a request to delete cart
                        request(delete_cartitems, function (error, respons, body) {
                            var data=JSON.parse(body);
                            if(data.code=200){
                                var user_id=cart.user_id;
                                var total_quantity=cart.total_quantity;
                                var total_price=cart.total_price;
                                var productchunk=cart.products;//array of all the products
                                res.render('shop/checkout', { title: 'Amazons Coffee Shop',total_price : total_price , total_quantity: total_quantity,products: productchunk, layout:'shoppingcart'});
                                //show order placed by passing order to the hbs page via render
                            }
                            else{
                                res.render('shop/success',{'msg':'Order Placed | Notification Sent | Unable to empty shopping cart'})
                            }
                        });
                    }
                    else{
                        res.render('shop/success',{'msg':'Order Placed | Unable to send Notification'})
                    }

                });
            }
            else{
                res.render('shop/success',{'msg':data.msg})
            }
        });

    });    
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/user/signin');
}

module.exports = router;
