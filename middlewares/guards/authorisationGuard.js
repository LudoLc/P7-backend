// une fois que la connexion est établie , on recupere le token , puis on s'assure que nous soyons bien identifié sur notre propre session

// connection guard doit FORCEMENT etre appele juste avant
module.exports = (req, res, next) => {
  if (req.state.get("isAdmin")) return next();
  const decodedToken = req.state.get("TOKEN"); // on recupere le Token a partir du auth middleware
  // /api/user/:id => id: string | decodedToken => id: number | donc number === string => false ALORS QUE number == string => true
  if (/^\/api\/users/.test(req.originalUrl) && req.params.id == decodedToken.id)
    return next();
  else if (req.body?.userId === decodedToken.id) return next(); // a partir du req.body.id ou req.body.userId du user
  res.status(401).send({ error: "Acces non autorise" }); //on vérifie si les 2 tokens sont identiques, auquel cas si oui => return undifined, si non, fonction next()
};
