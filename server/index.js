const express = require('express');
const app = express();
const cors = require('cors');
const port = 2708;
const axios = require('axios').default;

app.use(cors())


/**
 * 
 * To learn for this - return json with success code for next API
 * 
 */
/* 
* currency conversion
* returns rate for 1 unit of :currency_from to currency_to
* the rest of math is handeled by the client
*/
app.get('/currency-conversion/:currency_from/:currency_to', (req, res) => {
    const currency_from = req.params.currency_from;
    const currency_to = req.params.currency_to;

    var options = {
        method: 'GET',
        url: 'https://currency-converter5.p.rapidapi.com/currency/convert',
        params: {format: 'json', from: currency_from, to: currency_to, amount: '1'},
        headers: {
          'x-rapidapi-key': 'b043a90f3cmshbd35b94ac225e93p1c1dd4jsn0d5de95c6088',
          'x-rapidapi-host': 'currency-converter5.p.rapidapi.com'
        }
      };
      
      axios.request(options).then(function (response) {
          var response_object = Object.entries(response.data.rates);
          var result;

          for(const [key, value] of response_object){
            result = value.rate;

          }

          res.json(result);
      }).catch(function (error) {
          console.error(error);
      });


})

/*
*  returns a list of avalible currencies
*
*
*/
app.get('/get-available-currencies/', (req, res) => {

    var options = {
        method: 'GET',
        url: 'https://currency-converter5.p.rapidapi.com/currency/list',
        headers: {
          'x-rapidapi-key': 'b043a90f3cmshbd35b94ac225e93p1c1dd4jsn0d5de95c6088',
          'x-rapidapi-host': 'currency-converter5.p.rapidapi.com'
        }
      };
      
      axios.request(options).then(function (response) {
          if(response.data.status === 'success') res.json(response.data.currencies);
          else throw error('Error: Cannot fetch available currencies.')

      }).catch(function (error) {
          console.error(error);
      });
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })