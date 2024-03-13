const route = require('express').Router();
const User = require('../../models/user');

const msg = {
    E_INTERNAL: (operation) => {return `An error occured when attempting to ${operation}: `},
    E_BAD_REQUEST: (reason) => {return `Bad Request: ${reason}` }
}

route.post('/', async (req, res) => {
    try {
        // Reject the request if one of the required fields are missing
        if (!req.body.email || !req.body.password) {
            res.status(403).json({
                message: msg.E_BAD_REQUEST("one or more required parameters are missing")
            });
            return;
        }

        const result = await User.create(req.body);
        console.log("Create new user result:\n", result);

        res.status(200).json({
            message: "Success"
        });
        return;
    } catch (error) {
        const operation = "create a new user";
        console.error( msg.E_INTERNAL(operation), error );
        res.status(500).json({
            message: msg.E_INTERNAL(operation) 
        });
        return;
    }
});

// route.put('/:id', (req, res) => {

// });

module.exports = route;