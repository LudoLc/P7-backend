const { loginSchema, signupSchema } = require("../schemas/auth");
const { yupErrorToJson } = require("../src/helpers");

class AuthController {
  // classe qui contient les données du login et signup afin de les réutiliser
  login(req, res) {
    loginSchema
      .validate(req.body, { abortEarly: false, strict: true })
      .then(() => {
        res.status(201).send({
          // renvoie une 201 et genère un token
          token:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
        });
      })
      .catch((errors) => {
        res.status(400).send({
          // renvoie un status 400 en cas de non remplissage de conditions
          errors: yupErrorToJson(errors),
        });
      });
  }
  signup(req, res) {
    signupSchema
      .validate(req.body, { abortEarly: false, strict: true })
      .then(() => {
        res.status(201).send({
          // si les conditions sont remplies renvoie une 201 avec les données nécessaires à l'utilisateur.
          message: "Created",
          firstname: "string",
          username: "string",
          email: "user@example.com",
          password: "string",
          question: "string",
          reponse: "string",
        });
      })
      .catch((errors) => {
        res.status(400).send({
          // renvoie un status 400 en cas de non remplissage de conditions
          errors: yupErrorToJson(errors),
        });
      });
  }
}

module.exports = new AuthController();
