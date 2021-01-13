const express = require('express');
const app = express();
const cors = require('cors');
const port = 2708;

app.use(cors())

app.get('/', (req, res) => {

    res.json('{message: Hello}');
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })