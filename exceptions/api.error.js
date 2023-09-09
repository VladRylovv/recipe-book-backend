module.exports = class ApiError extends Error {
    status;
    errors;
    message;
    conflictField;

    constructor(status, message, errors = [], conflictField) {
        super();
        this.message = message
        this.status = status
        this.errors = errors
    }

    static UnauthorizedError() {
        return new ApiError(401, "Unauthorized")
    }

    static BadRequest(message, errors = []) {
        return new ApiError(400, message, errors)
    }

    static Conflict(message, errors) {
        return new ApiError(409, message, errors)
    }

    static NotFound() {
        return new ApiError(404, "Not found")
    }
}
