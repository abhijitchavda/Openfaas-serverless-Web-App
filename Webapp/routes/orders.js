var express = require('express');
var router = express.Router();
var Request = require('request');
var const_file=require('../public/javascripts/constants.js');
var ip="localhost:8080"//----------------->ip of the backend
 
router.get('/', isLoggedIn,function(req, res, next) {	
	var userId = req.session.passport.user;
	var headers = {
   	    'User-Agent':       'Super Agent/0.0.1',
        'Content-Type':     'application/x-www-form-urlencoded'
    };
    var get_orders={
        url: 'http://'+ip+'/function/func_check_out_micro',
        method: 'POST',
        headers: headers,
        form: JSON.stringify({"user_id":userId})
    };
    //start request to get list of all the orders place by this user
    Request(get_orders, function (error, respo, body) {
        var data = JSON.parse(body)
        /*
            parse the list of orders and render on orders.hbs
            */
        if(data.code== 200)
        {
            var user_id = data.user_id;
            var orders = data.orders;
            for(var i=0;i<orders.length;i++){
                var product="";
                for(var j=0;j<orders[i].products.length;j++){
                    product+=(orders[i].products[j].product_name)+","
                }
                orders[i].products=product;
            }
            res.render('shop/orders', { title: 'Amazons Coffee Shop',orders: orders,layout:'checkout'});
        }
        else
        {
            res.render('shop/success',{'msg':' No Orders till Now'})
        }
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/user/signin')
}

module.exports = router;