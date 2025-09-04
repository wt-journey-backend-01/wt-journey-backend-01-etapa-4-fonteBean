function errorResponse(req,res, statusCode, message) {
    res.status(statusCode).json({ error: message });
}

module.exports = errorResponse