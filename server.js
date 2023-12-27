const dotenv = require('dotenv');

dotenv.config();

const app = require('./app');

const port = 3000;

// START THE SERVER
app.listen(port, () => {
    console.log(`Server running on port ${port}...`);
});
