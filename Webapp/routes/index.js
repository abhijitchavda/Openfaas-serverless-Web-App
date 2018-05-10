var express = require('express');
var router = express.Router();
var Request=require('request');
var constm=require('../public/javascripts/constants.js');
var serverippc = constm.server_ip_pc;
var serverportpc=constm.server_port_pc;
var passport = require('passport');
var userid;
var product;
var catagori;
var flag=0;
var productChunks=[];
var ip="localhost:8080"//---------------------->change ip
var ip_abhi="localhost:8080"
/* GET home page. */

router.get('/',isLoggedIn, function(req, res, next) {
    //start request to get all the products
    Request.get('http://'+ip+'/function/func_get-product-catalog-from-mongodb', function (error, response, body) {
        if (error) {
            throw error;
        }
        data = JSON.parse(body);
        product=data["products"];
        productChunks=[];
        var chunkSize=4;
        for(var i=0;i< product.length;i +=chunkSize){
            productChunks.push(product.slice(i,i+chunkSize));
        }
        res.render('shop/index', { title: 'Amazons Coffee Shop',products: productChunks,layout:'productCatalogue'});
    });

});

router.get('/addtocart/:cid',isLoggedIn,function(req, res, next){
    var it=parseInt(req.params.cid);
    var c_id;
    var product;
    var c_id=req.session.passport.user;
    var form = {
        product_id: it
    };
    var formData = JSON.stringify(form);
    var contentLength = formData.length;
    //start request to get the product details based on the product id
    Request({
        headers: {
          'Content-Length': contentLength,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        uri: 'http://'+ip+'/function/func_get_product_details',
        body: formData,
        method: 'POST'
        }, function (err, response, body) {
            if (err) {
                        throw error;
                    }
            data = JSON.parse(body);
            if(data.code==400){
                res.render('shop/success',{'msg':'Unable to add the product | Try again'})
            }
            else {
                products=data["products"];
                product=products[0];
                var headers = {
                    'User-Agent':       'Super Agent/0.0.1',
                    'Content-Type':     'application/x-www-form-urlencoded'
                };
                prd={'user_id':c_id,'product_name': product.name,
                'product_desc': product.description,'product_price': product.price}
                var options = {
                    url: 'http://'+ip_abhi+'/function/func_shopping_cart_micro',//add shopping cart serverip
                    method: 'POST',
                    headers: headers,
                    form: JSON.stringify(prd)
                }
                //start the request to add the product to shopping cart
                Request(options, function (error, resp, bod) {
                    if (error) {
                        throw error;
                    }
                    var data = JSON.parse(bod);
                    if(data.code=="200"){
                        res.redirect('/productcatalog'); 
                    }
                    else{
                        res.render('shop/success',{'msg':'Unable to add the product | Try again'})
                    }
                });
            }
      });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()||flag==1){
        return next();
    }
    res.redirect('/user/signin')
}

module.exports = router;
