/**
 * 
 * @param {Express.Response} res 
 * @param {string} message 
 * @param {number} statusCode 
 * @param { { statusCode:number, message:string }[] } errors 
 * @returns
 */
exports.successResponse = (res, message, statusCode = 200, data = []) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};
