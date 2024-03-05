// This is a file intended to act as the codepoint for prototyping experiments
// None of the functional components in this code should be in the final version. Don't you dare!
const express = require('express');
const sequelize = require('./config/test-db');

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

sequelize.sync().then(() => {
    app.listen(PORT, () => console.log(`Now listening on port ${PORT}`));
})