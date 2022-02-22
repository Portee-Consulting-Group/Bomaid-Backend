class AppError extends Error {
    constructor(message, status) {
        super(message);

        this.name = this.constructor.name;
        this.stack = Error.captureStackTrace(this, this.constructor);
        this.status = status || 500;
    }
};

class NotFoundException extends AppError{
    constructor(message){
        super(message || "Item not found");
    }
};

class AlreadyExistsException extends AppError{
    constructor(message){
        super(message || "Item already exists");
    }
};


class NullReferenceException extends AppError{
    constructor(message){
        super(message || "One or more null items found");
    }
};

class CustomException extends AppError{
    constructor(message){
        super(message || "Internal app error");
    }
}


module.exports = {
    NotFoundException,
    AlreadyExistsException,
    NullReferenceException,
    CustomException
};