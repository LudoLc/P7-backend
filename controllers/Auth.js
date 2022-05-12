const { User, Role } = require("../models");
const { ValidationError } = require("yup");
const { loginSchema, signupSchema } = require("../schemas/auth");
const { yupErrorToJson } = require("../src/helpers");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class AuthController {
  // classe qui contient les données du login et signup afin de les réutiliser
  async login(req, res) {
    try {
      await loginSchema.validate(req.body, { abortEarly: false, strict: true });
      const user = await User.findOne({
        where: {
          email: req.body.email,
        },
        include: Role,
      });

      if (user === null || user.Role === null)
        return res.status(404).send({
          error: "Utilisateur non trouvé!",
        });

      if (!bcrypt.compareSync(req.body.password, user.password))
        return res.status(401).send({
          errors: {
            password: ["Mot de passe incorrect!"],
          },
        });

      // on verifie si le rôle est bien dans le modele Role
      return res.status(201).send({
        // infos: JSON.stringify(user),
        // renvoie une 201 et genère un token
        user,
        token: jwt.sign(user.get(), process.env.SECRET_JWT_KEY, {
          expiresIn: 60 * 60 * 24 * 45,
        }),
      });
    } catch (error) {
      if (error instanceof ValidationError)
        return res.status(400).send({
          // renvoie un status 400 en cas de non remplissage de conditions
          errors: yupErrorToJson(error),
        });

      res.status(500).send({ error: "Internal server error" });
    }
  }
  async signup(req, res) {
    try {
      await signupSchema.validate(req.body, {
        abortEarly: false,
        strict: true,
      });

      const userCreated = await User.create(
        Object.assign(req.body, {
          RoleId: 1,
          password: bcrypt.hashSync(req.body.password, 10),
        })
      ); // fonction pour créer l'utilisateur si les données remplies avant sont bonnes
      const user = await User.findOne({
        where: {
          email: userCreated.email,
        },
        include: Role,
      });
      res.status(201).send({
        // si les conditions sont remplies renvoie une 201 avec les données nécessaires à l'utilisateur.
        message: "Crée",
        token: jwt.sign(user.get(), process.env.SECRET_JWT_KEY, {
          expiresIn: 60 * 60 * 24 * 45,
        }),
      });
    } catch (error) {
      if (error instanceof ValidationError){
        return res.status(400).send({
          // renvoie un status 400 en cas de non remplissage de conditions
          errors: yupErrorToJson(error),
        });
      }

      res.status(409).send({
        error: "L'email ou le username est déjà utilisé!",
        error,
      });
    }
  }
}

module.exports = new AuthController();
