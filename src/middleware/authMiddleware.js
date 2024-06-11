const jwt = require('jsonwebtoken');
const constants = require('../config/constants'); // Assurez-vous d'importer correctement vos constantes

exports.authenticateUser = (req, res, next) => {
  const token = req.header('Authorization');
      console.log("decoded token", token)
  if (!token) {
    return res.status(401).json({ message: 'Accès non autorisé. Token manquant.' });
  }


  try {
    const decoded = jwt.verify(token, constants.secretKeyToken);
    req.user = decoded.user;

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Accès non autorisé. Token invalide.' });
  }
};

exports.authorizeAdmin = (req, res, next) => {
  const token = req.header('Authorization');
  const decoded = jwt.verify(token, constants.secretKeyToken);
  console.log('decoded', decoded)
  req.user = decoded.user;
  if(decoded && decoded.role === 'admin') {
    next()
  } else {
    res.status(403).json({
      message :  'Accès interdit. Vous devez être administrateur.'
    })
  }
}
 