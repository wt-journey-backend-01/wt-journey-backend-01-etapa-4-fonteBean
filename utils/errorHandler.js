function errorResponse(res, statusCode, message) {
  return res.status(statusCode).json({ error: message });
}

module.exports = errorResponse