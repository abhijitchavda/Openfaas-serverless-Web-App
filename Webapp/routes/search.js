var express = require('express');
var router = express.Router();
var Request=require('request');
var constm=require('../public/javascripts/constants.js');
var passport = require('passport');
var userid;
var product;
var catagori;
var flag=0;
var productChunks=[];
var ip="localhost:8080"//------------->update ip and port
router.post('/',isLoggedIn, function(req, response, next) {
    var form = {
        category: req.body.data
    };

    var formData = JSON.stringify(form);
    var contentLength = formData.length;
    //start request to search the product
    Request({
        headers: {
          'Content-Length': contentLength,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        uri: 'http://'+ip+'/function/func_search-by-category',
        body: formData,
        method: 'POST'
      }, function (err, res, body) {
        if (err) {
                     throw error;
                 }
        data = JSON.parse(body);
        console.log(data);
        if(data.code==400){
            res.render('shop/success',{'msg':'Unable to find products for this category | Try Again'})
        }
        else{
            product=data["products"];
            console.log("-----------------");
            console.log(product);
            productChunks=[];
            var chunkSize=4;
            for(var i=0;i< product.length;i +=chunkSize){
                productChunks.push(product.slice(i,i+chunkSize));
            }
            response.render('shop/index', { title: 'Amazons Coffee Shop',products: productChunks,layout:'productCatalogue'});
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