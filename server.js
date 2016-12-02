const express = require('express');
const request = require('request');
const location = require('location');

// const dotenv = require('dotenv');
// dotenv.config();

const server = express();
const apiKey = process.env.APIKEY; // need to swap out into .env file

server.get('/', (req, res) => {
  res.send('hello! this is locationbot');  
});

server.post('/', (req, res) => {
  req.on('data', (data) => {
    location()
    .then(locationdata => {

      // credits to Chase Starr
      data = JSON.parse(data.toString());
      var message = data.text;
      if (message.split(' ')[0] === '/location') {
        const payload = {
         "apiKey": apiKey,
         "method": "message",
         "room": data.room,
         "action": {
           "text": `Here's your current location: lat: ${locationdata.latitude}, long: ${locationdata.longitude}`,
           "image": null,
           "avatar": "https://www.spotteron.com/images/features/SEO-47.png"
         }
        };

        request.post({
          // url: "http://localhost:8000/apps",
          url: 'http://gittalk.co/apps',
          json: payload
        }, (err, response, body) => {
          if (err) { 
            console.log(err);
          }
          res.end(); 
        });       
      }
    })
    .catch(err => console.log(err));
  });
});

console.log(`listening to port ${process.env.PORT || 1234}`);
server.listen(process.env.PORT || 1234);