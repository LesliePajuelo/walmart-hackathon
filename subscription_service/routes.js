'use strict'
const router = require("express").Router();
const Customer = require("./models/customer");
const Subscriptions = require("./models/subscriptions");
const Predictions = require("./models/predictions");
const Notification = require('./models/notification');
const request = require('request');

router.get("/", function(req, res){
    res.send("Hello world");
})

router.get("/api/subscriptions", function(req, res){
    // should find the customer in the database
    let customerId = req.query.customerId;

    Subscriptions.find({customerId: customerId}, function(err, subscriptions){
        if(err){
            throw err;
        }
       if(subscriptions.length > 0){
            res.json(subscriptions);
       } else {
           res.send("No subscriptions found");
       }

        //res.json ({foo:'bar'});

    })

});


router.post("/api/subscriptions", function(req, res){
       const response = req.body;
       //console.log('incoming',  incoming.subscriptionId);
        let subscription = new Subscriptions();
        subscription.subscriptionId = response.subscriptionId;
        subscription.customerId=response.customerId;
        subscription.products = response.products;
        subscription.schedule=response.schedule;
        subscription.paymentInfo = response.paymentInfo;

        subscription.save(function(err){
            if (err) {
                console.log(err);
                return err;
            }
            res.send("saved");
        })
});

router.get("/api/predictions", function(req, res){
    // should find the customer in the database
    let customerId = req.query.customerId;

    Predictions.find({customerId: customerId}, function(err, predictions){
        if(err){
            throw err;
        }
        if(predictions.length > 0){
            res.json(predictions);
        } else {
            res.send("No predictions found");
        }

        //res.json ({foo:'bar'});

    })

});

router.post("/api/predictions", function(req, res){
    const response = req.body;
    let predictions = new Predictions();
    predictions.customerId=response.customerId;
    predictions.products = response.products;
    predictions.schedule=response.schedule;


    predictions.save(function(err){
        if (err) {
            console.log(err);
            return err;
        }
        res.send("predictions saved");
    })
});

router.get("/api/customerInfo", function(req, res){
    // should find the customer in the database
    let customerId = req.query.customerId;

    Customer.findOne({customerId: customerId}, function(err, customer){
        if(err){
            throw err;
        }
        res.json(customer);

    })

});

router.get("/api/customerInfo/:phoneNumber", function(req, res){
    // should find the customer in the database
    const phoneNumber = req.params.phoneNumber;

    Customer.findOne({phone_number: phoneNumber}, function(err, customer){
        if(err){
            throw err;
        }
        res.json(customer);

    })

});



router.get("/api/notification", function(req, res){
    const phoneNumber = req.query.phoneNumber;
    Notification.find({}, function(err, notifications){
        if(err) throw err;
        res.send(notifications);
    })
});

router.post("/api/notification", function(req, res){
   const notification = new Notification();
   notification.phoneNumber = req.body.phoneNumber;
   notification.customerId = req.body.customerId;
    notification.products = req.body.products;
    notification.save(function(err, result){
        if(err){
            throw err;
        }
        res.send("notification saved");
    })
});

router.get("/api/productName", function(req, res){
    var productId = req.query.productId;
    var apiKey = '7ysuvzkdw26n9x8jxwyzx568';
    var url = "http://api.walmartlabs.com/v1/items/" + productId + "?apiKey=" + apiKey +"&format=json";

    request(url, function(err, response, body){
        if (err) throw err;
        var name = JSON.parse(body).name;
        res.send(name);
    })



})

module.exports = router;