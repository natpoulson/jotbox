const route = require('express').Router();
const User = require('../../models/user');

const msg = {
    INTERNAL: (operation) => {return `An unexpected error occured when attempting to ${operation}`},
    BAD_REQUEST: (reason) => {return `Bad Request: ${reason}` },
    VALIDATION_FAIL: "One or more values provided failed validation",
    OPERATION_SUCCESS: (operation) => {return `${operation} succeeded`}
}

const errType = {
    VALIDATION_FAIL: "SequelizeValidationError"
}

function errorHandler(error, operation) {
    switch (error.name) {
        case errType.VALIDATION_FAIL:
            res.status(400).json({
                message: msg.VALIDATION_FAIL,
                reasons: error.errors.map(err => err.message)
            });
            return;
        default:
            console.error(error);
            res.status(500).json({
                message: msg.INTERNAL(operation) 
            });
            return;
    }
}

route.post('/', async (req, res) => {
    try {
        // Reject the request if one of the required fields are missing
        if (!req.body.email || !req.body.password) {
            res.status(403).json({
                message: msg.BAD_REQUEST("one or more required parameters are missing")
            });
            return;
        }

        // Perform operation and normalise the output
        const newUser = (await User.create(req.body)).get({plain: true});

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