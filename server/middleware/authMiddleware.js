const jwt = require('jsonwebtoken')

function authMiddleware(req, res, next) {
  const token = req.header('Authorization')

  if (!token) {
    return res.status(401).json({ error: 'No token, access denied' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.id
    next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
}

module.exports = authMiddleware