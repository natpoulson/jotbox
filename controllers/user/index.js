const route = require('express').Router();
const { compare } = require('bcrypt');
const User = require('../../models/user');

const msg = {
    INTERNAL: (operation) => {return `An unexpected error occured when attempting to ${operation}`},
    BAD_REQUEST: (reason) => {return `Bad Request: ${reason}` },
    VALIDATION_FAIL: "One or more values provided failed validation",
    OPERATION_SUCCESS: (operation) => {return `${operation} succeeded`},
    NO_EMAIL: "E-mail address not provided",
    NO_PASSWORD: "Password not provided",
    MISSING_PARAMS: "One or more required parameters are missing",
    NOT_FOUND: "User not found"
}

const errType = {
    VALIDATION_FAIL: "SequelizeValidationError",
    MISSING_REQUEST_FIELD: "MissingRequestField"
}

function errorHandler(error, operation) {
    const getReasons = () => {
        return error.errors.map(err => err.message)
    }

    switch (error.name) {
        case errType.VALIDATION_FAIL:
            res.status(400).json({
                message: msg.VALIDATION_FAIL,
                reasons: getReasons()
            });
            return;
        case errType.MISSING_REQUEST_FIELD:
            res.status(400).json({
                message: msg.BAD_REQUEST(msg.MISSING_PARAMS),
                reasons: getReasons()
            })
        default:
            console.error(error);
            res.status(500).json({
                message: msg.INTERNAL(operation),
                reasons: getReasons()
            });
            return;
    }
}

route.get('/', async (req, res) => {
    try {
        // For pulling a user's data when ready
        const fetchUser = () => {
            const user = await (User.findByPk(req.session.uid)).get({ plain: true });

            const responseObject = Object.keys(user).forEach(name => {
                if (name !== 'password') {
                    responseObject[name] = user[name];
                }
            });

            return responseObject;
        }

        // Just return the user's data if they have an active session
        if (req.session.signedIn) {
            res.status(200).json(fetchUser());
        }

        // Filter out user if there's no email
        if (!req.body.email) {
            const err = new Error(msg.NO_EMAIL);
            err.name = errType.MISSING_REQUEST_FIELD;
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
                message: msg.NOT_FOUND
            });
            return;
        }

        // Filter out if the body has no password
        if (!req.body.password) {
            const err = new Error(msg.NO_PASSWORD);
            err.name = errType.MISSING_REQUEST_FIELD;
            throw err;
        }

        // Return the user's data and register a new session if they've provided valid data
        if (user.checkLogin(req.body.password)) {
            const user = fetchUser();
            req.session.save(() => {
                req.session.signedIn = true;
                req.session.uid = user.id;
            });
            res.status(200).json(user);
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
                message: msg.BAD_REQUEST(msg.MISSING_PARAMS)
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

// route.put('/:id', (req, res) => {

// });

module.exports = route;