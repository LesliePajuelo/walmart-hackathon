const http = require('http');
const express = require('express');
const request = require('request');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');
//const utils = require('./utils');


const app = express();

app.use(bodyParser());

app.get('/', function(req, res){
    res.end("Twilio subscripton app");
});

app.post('/sms', (req, res) => {
    const twiml = new MessagingResponse();


console.log("request body:", req.body);

    // add logic here to update your account with subscriptions
let phoneNumber = req.body.From;
phoneNumber  = phoneNumber.replace(/[+]/,'');

request.get('http://subscription-service-hackathon.herokuapp.com/api/customerInfo/' + phoneNumber, function(err, responseForGet, body){
    if(err) throw err;
    console.log("response from api:", body);
    const jsonPayload = {
        "subscriptionId": Math.floor((Math.random() * 100) + 1),
        "customerId": body.customerId,
        "products": body.products,
        "schedule": {
            "date": "6/2/2017",
            "frequency": "30"
        },
        "paymentInfo": "4405321359603118",
        "Address": "Lebsack LLC"
    }

    // call to save the newly accepted subscriptions in database
    const options = {

        headers: {'content-type' : 'application/json'},
        url:     'https://subscription-service-hackathon.herokuapp.com/api/subscriptions',
        json:    jsonPayload
    }

        request.post(options, (err, response, body) => {
            if(err){
                console.log(err);
            }
            console.log("Response from save subsctiptions api", body);
            twiml.message(body);
            res.writeHead(200, {'Content-Type': 'text/xml'});
            console.log(twiml.toString());
            res.end(twiml.toString());
    });
});



});

http.createServer(app).listen(process.env.PORT || 5000, () => {
    console.log('Express server listening on port 5000');
});