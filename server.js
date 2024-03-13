// Import expresss, database connection, and controllers
const express = require('express');
const db = require('./config/db');
const controller = require('./controllers');
require('dotenv').config();

// Import and prepare Sessions
const sessions = require('express-session');
const SequelizeStore = require('express-session-sequelize')(sessions.Store);

// Define Session parameters
const session = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new SequelizeStore({
        db: db
    })
}

// Initialise the app
const app = express();
const PORT = process.env.PORT || 3001;

// Initialise middleware
app.use(sessions(session));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(controller);

// Debug Route
app.get('/', (req, res) => {
    res.json({
        signedIn: req.session.signedIn
    });
})

// DB Sync and listener start
db.sync({alter: true}).then(() => {
    app.listen(PORT, () => {
        console.log("Now listening on port", PORT);
    });
});