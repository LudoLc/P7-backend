//récuperation du token , et si il ne l'a pas ==> renvoie une erreur

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  if (!("state" in req)) req.state = new Map(); // creation d'un etat dynamique, puis stockage du bearer token dedans
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.SECRET_JWT_KEY);
    req.state.set("TOKEN", decodedToken);
    req.state.set("Connected", true); // connexion
    req.state.set("isAdmin", decodedToken.Role.admin);
  } catch (error) {
    console.error(error);
    req.state.set("TOKEN", null);
    req.state.set("Connected", false); // non connecté
    req.state.set("isAdmin", false);
  } finally {
    // execute le code des que la promesse à été traitée
    next();
  }
};
