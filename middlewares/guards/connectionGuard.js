// verifie si la connexion est bien établie
module.exports = (req, res, next) => {
  if (req.state.get("Connected")) return next();
  res.status(401).send({ error: "Accès non authorisé" });
};
