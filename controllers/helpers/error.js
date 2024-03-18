const msg = require('./messages.json');

const errorType = {
    VALIDATION_FAIL: "SequelizeValidationError",
    MISSING_REQUEST_FIELD: "MissingRequestField"
}

function errorHandler(error, operation = "") {
    const getReasons = () => {
        return error.errors.map(err => err.message)
    }

    let messagePrefix = "An error occurred";
    if (operation) {
        messagePrefix += ` while attempting to ${operation}`
    }
    messagePrefix += ': ';

    switch (error.name) {
        case errorType.VALIDATION_FAIL:
            res.status(400).json({
                message: messagePrefix += msg.error.general.VALIDATION_FAIL,
                reasons: getReasons()
            });
            return;
        case errorType.MISSING_REQUEST_FIELD:
            res.status(400).json({
                message: messagePrefix += msg.error.general.MISSING_PARAMS,
                reasons: getReasons()
            })
        default:
            console.error(error);
            res.status(500).json({
                message: messagePrefix += msg.error.general.INTERNAL_ERROR,
                reasons: getReasons()
            });
            return;
    }
}

module.exports = {
    errorType,
    errorHandler
}