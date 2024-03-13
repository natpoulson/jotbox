const express = require('express');
const db = require('./config/db');
const controller = require('./controllers');

const app = express();
const PORT = 3001;

app.use(express.json);
app.use(express.urlencoded({extended: true}));
app.use(controller);

db.sync({force: true}).then(() => {
    app.listen(PORT, () => {
        console.log("Now listening on port ", PORT);
    });
});