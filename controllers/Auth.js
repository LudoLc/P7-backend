const { ValidationError } = require("yup");
const User = require("../models/User");
const { loginSchema, signupSchema } = require("../schemas/auth");
const { yupErrorToJson } = require("../src/helpers");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class AuthController {
  // classe qui contient les données du login et signup afin de les réutiliser
  login(req, res) {
    loginSchema
      .validate(req.body, { abortEarly: false, strict: true })
      .then(async () => {
        const user = await User.findOne({
          where: {
            email: req.body.email,
          },
        });
        if (user instanceof User) {
          if (bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(201).send({
              // renvoie une 201 et genère un token

              token: jwt.sign({
                id: user.id,
                email: user.email,
                username: user.username,
              }, process.env.SECRET_JWT_KEY, { expiresIn: Date.now() + 1000 * 60 * 60 * 24 * 45 })
            });
          }
          return res.status(401).send({
            errors: {
              password: ["Mot de passe incorrect!"],
            },
          });
        }
        res.status(404).send({
          error: "User not found",
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
      .then(async () => {
        // fonction asynchrone
        const user = await User.create(req.body); // fonction pour créer l'utilisateur si les données remplies avant sont bonnes
        res.status(201).send({
          // si les conditions sont remplies renvoie une 201 avec les données nécessaires à l'utilisateur.
          message: "Created",
          ...user.get(),
        });
      })
      .catch((error) => {
        if (error instanceof ValidationError)
          return res.status(400).send({
            // renvoie un status 400 en cas de non remplissage de conditions
            errors: yupErrorToJson(error),
          });
        res.status(409).send({
          errors: {
            email: ["Cet email existe déjà!"],
          },
        });
      });
  }
}

module.exports = new AuthController();
