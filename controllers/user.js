const route = require('express').Router();
const User = require('../models/user');
const { errorType, errorHandler } = require('./helpers/error');
const msg = require('./helpers/messages.json');

const fetchUser = async (req) => {
    const user = await (User.findByPk(req.session.uid)).get({ plain: true });

    const responseObject = Object.keys(user).forEach(name => {
        if (name !== 'password') {
            responseObject[name] = user[name];
        }
    });

    return responseObject;
}

route.get('/', async (req, res) => {
    try {
        // Just return the user's data if they have an active session
        if (req.session.signedIn) {
            res.status(200).json({
                message: msg.response.user.GET,
                details: await fetchUser(req)
            });
        }

        // Filter out user if there's no email
        if (!req.body.email) {
            const err = new Error(msg.error.user.NO_EMAIL);
            err.name = errorType.MISSING_REQUEST_FIELD;
            throw err;
        }

        const user = await User.findOne({
            where: {
                email: req.body.email
            }
        });

        // Filter out if user doesn't exist
        if (!user) {
            res.status(404).json({
                message: msg.error.user.NOT_FOUND,
                details: []
            });
            return;
        }

        // Filter out if the body has no password
        if (!req.body.password) {
            const err = new Error(msg.error.user.NO_PASSWORD);
            err.name = errorType.MISSING_REQUEST_FIELD;
            throw err;
        }

        // Return the user's data and register a new session if they've provided valid data
        if (user.checkLogin(req.body.password)) {
            const user = fetchUser(req);
            req.session.save(() => {
                req.session.signedIn = true;
                req.session.uid = user.id;
            });
            res.status(200).json({
                message: msg.response.user.GET,
                details: user
            });
        }

    } catch (error) {
        errorHandler(error, "fetch a user");
        return;
    }
});

route.post('/', async (req, res) => {
    try {
        // Reject the request if one of the required fields are missing
        if (!req.body.email || !req.body.password) {
            res.status(403).json({
                message: msg.error.general.MISSING_PARAMS,
                details: [
                    !req.body.email ? msg.error.user.NO_EMAIL : undefined,
                    !req.body.password ? msg.error.user.NO_PASSWORD : undefined
                ]
            });
            return;
        }

        // Perform operation and normalise the output
        const newUser = (await User.create(req.body)).get({plain: true});

        // Initialise a new session for our user
        req.session.save(() => {
            req.session.uid = newUser.id;
            req.session.signedIn = true;
        });

        // Return new user record
        res.status(200).json({
            message: msg.OPERATION_SUCCESS("Create"),
            details: {
                id: newUser.id,
                email: newUser.email,
                display_name: newUser.display_name
            }
        });

        return;
    } catch (error) {
        errorHandler(error, "create a new user");
        return;
    }
});

route.put('/:id', async (req, res) => {
    try {
        const updateUser = async (req, user) => {
            const simpleUser = user.get({plain: true}); // Obtain the user object in its most simple form for easier checking

            for (const key of Object.keys(req.body)) {
                if (!/^(?:new_)?password$|^id$/.test(key)) {
                    simpleUser[key] = req.body[key]; // Update the value of simpleUser
                }
            }

            // Check if there's a password and new_password field in the req.body

            // Update if the password is valid

        }

        // Fetch user for checks
        const user = await fetchUser(req);

        // If user's already signed in then just start checking the updates they want to make
        if (req.session.signedIn) {
            await updateUser(req, user);
        }

        // Handling if no user found
        if (!user) {
            res.status(404).json({
                message: msg.error.user.NOT_FOUND,
                details: []
            });
            return;
        }

    } catch (error) {
        errorHandler(error, "update a user");
        return;
    }
});

module.exports = route;