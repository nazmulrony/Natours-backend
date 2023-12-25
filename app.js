const express = require('express');
const fs = require('fs')

const app = express();

const port = 3000;

app.get('/', (req, res) => {
    res.status(200).send({ message: 'Hello from the server side.', app: "Natours" })

})

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))

app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: { tours }
    })

})

app.listen(port, () => {
    console.log(`Server running on port ${port}...`);
})



