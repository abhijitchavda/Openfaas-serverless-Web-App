var express = require('express');
var router = express.Router();
var request=require('request');
var passport = require('passport');
var ip="localhost:8080"//------------------------> ip of the backend with port
var productChunks = [];
var quantity = 0;
var price = 0;

router.get('/',isLoggedIn, function(req, res, next) {
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
// Start the request
    request(options, function (error, resp, body) {
        if (error) {
            throw error;
        }
        var data = JSON.parse(body);
        //if(data.code==200){
            console.log("Data"+JSON.stringify(data));
            quantity = data.total_quantity;
            price = data.total_price;
            productChunks = data.products;
            res.render('shop/shoppingcart', { title: 'Amazons Coffee Shop',
                total_price : price , total_quantity: quantity,
                products: productChunks, layout:'shoppingcart'});
        //}
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/user/signin')
}
module.exports = router;