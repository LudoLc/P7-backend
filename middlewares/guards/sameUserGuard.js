// une fois que la connexion est établie , on recupere le token , puis on s'assure que nous soyons bien identifié sur notre propre session

module.exports = (isUser) =>{ 
  return (req, res, next) =>{
    const decodedToken = req.state.get("TOKEN") // on recupere le Token
    if(req.body?.[isUser ? "id" : "userId"] === decodedToken.id) return next() // a partir du req.body.id ou req.body.userId du user 
    res.status(401).send({error: "Acces non autorise"}) //on vérifie si les 2 tokens sont identiques, auquel cas si oui => return undifined, si non, fonction next()
  }
}
