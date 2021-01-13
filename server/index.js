const express = require('express');
const app = express();
const cors = require('cors');
const port = 2708;
const axios = require('axios').default;

app.use(cors())

// currency conversion
app.get('/currency-conversion/:currency_from/:currency_to', (req, res) => {
    const currency_from = req.params.currency_from;
    const currency_to = req.params.currency_to;

    var options = {
        method: 'GET',
        url: 'https://currency-converter5.p.rapidapi.com/currency/convert',
        params: {format: 'json', from: 'AUD', to: 'CAD', amount: '1'},
        headers: {
          'x-rapidapi-key': 'b043a90f3cmshbd35b94ac225e93p1c1dd4jsn0d5de95c6088',
          'x-rapidapi-host': 'currency-converter5.p.rapidapi.com'
        }
      };
      
      axios.request(options).then(function (response) {
          console.log(response.data);
      }).catch(function (error) {
          console.error(error);
      });


})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })