const express = require('express');
const cors = require('cors');
const app = express();
const cookieparser = require('cookie-parser');
const connect = require('./db/mongodb/connect');
const PORT = process.env.PORT || 4000;


app.use(express.json());
app.use(cors({ origin: '*' }));
app.use(cookieparser());


const main = async () => {
    try {
        const db = await connect();
        console.log(db);
        app.listen(PORT, () => {
            console.log('Server is listening on port ' + PORT + '!!');
        });
    }
    catch (err) {
        console.log(err);
    }
};

main();