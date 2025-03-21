const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Token malformado' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    console.log(user.userId);
    req.user = user; // Ahora req.user tiene el payload del token (por ejemplo, el userId)
    req.user.id = user.userId
    next();
  });
};

module.exports = authenticateToken;
