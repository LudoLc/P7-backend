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
      await loginSchema.validate(req.body, { abortEarly: false, strict: false });
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
        strict: false,
      });
    } catch (error) {
      return res.status(400).send({
        // renvoie un status 400 en cas de non remplissage de conditions
        errors: yupErrorToJson(error),
      });
    }
    let userCreated;
    try{
      userCreated = await User.create(
        Object.assign(req.body, {
          RoleId: 1,
          password: bcrypt.hashSync(req.body.password, 10),
          avatar: "http://localhost:3000/public/images/profile_white.png",
        })
      ); // fonction pour créer l'utilisateur si les données remplies avant sont bonnes
    } catch (error) {

      return res.status(409).send({
        error: "Erreur lors de la création de l'utilisateur",
      });
    }
    let user;
    try {
      user = await User.findOne({
        where: {
          email: userCreated.email,
        },
        attributes: {
          exclude: ["password"]
        },
        include: Role,
      });
    } catch (error) {

      return res.status(409).send({
        error: "Erreur lors de la récupération de l'utilisateur",
      });
    }

    return res.status(201).send({
      // si les conditions sont remplies renvoie une 201 avec les données nécessaires à l'utilisateur.
      message: "Crée",
      user,
      token: jwt.sign(user.get(), process.env.SECRET_JWT_KEY, {
        expiresIn: 60 * 60 * 24 * 45,
      }),
    });
  } 
}
module.exports = new AuthController();
