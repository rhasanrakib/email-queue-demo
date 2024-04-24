/**
 * 
 * @param {Express.Response} res 
 * @param {string} message 
 * @param {number} statusCode 
 * @param { { statusCode:number, message:string }[] } errors 
 */
exports.errorResponse = (res, message, statusCode = 500, errors = []) => {
    res.status(statusCode).json({
        success: false,
        message,
        errors
    });
};
