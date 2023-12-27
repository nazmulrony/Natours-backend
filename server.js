const app = require('./app');

const port = 3000;

// console.log(process.env);

// START THE SERVER
app.listen(port, () => {
    console.log(`Server running on port ${port}...`);
});
