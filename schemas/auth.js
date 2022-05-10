const yup = require('yup');


const loginSchema = yup.object().shape({
  email: yup.string().email("L'adresse email est invalide!").required("L'email est obligatoire!"),
  password: yup.string().required("Mot de passe demandé!").min(8,"doit contenir au minimum 8 caracteres").matches(/^[a-z0-9-\/\*\+@~\^=\(\)\{\}\[\]\?!\.,<>"_'éèàçùµ²%]+$/i) // à modifier lors du release , pass en strong password atm
})

const signupSchema = yup.object().shape({
  email: yup.string().email("L'adresse email est invalide!").required(),
  password: yup.string().required("Mot de passe demandé!").min(8, "doit contenir au minimum 8 caractres").matches(/^[a-z0-9-\/\*\+@~\^=\(\)\{\}\[\]\?!\.,<>"_'éèàçùµ²%]+$/i), // à modifier lors du release , pass en strong password atm
  username: yup.string().required("Nom demandé!"),
  firstname: yup.string().required("Prénom demandé!"),
  question: yup.string().required("La question est demandée!"),
  response: yup.string().required("La réponse est demandée!"),
})

exports.loginSchema = loginSchema;
exports.signupSchema = signupSchema;