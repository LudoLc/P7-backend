const yup = require('yup');


const loginSchema = yup.object().shape({
  email: yup.string().email("L'adresse email est invalide!").required(),
  password: yup.string().required("Mot de passe demandé!").min(8).matches(/^[a-z0-9-\/\*\+@~\^=\(\)\{\}\[\]\?!\.,<>"_'éèàçùµ²%]+$/i) // à modifier lors du release , pass en strong password atm
})

const signupSchema = yup.object().shape({
  email: yup.string().email("L'adresse email est invalide!").required(),
  password: yup.string().required("Mot de passe demandé!").min(8).matches(/^[a-z0-9-\/\*\+@~\^=\(\)\{\}\[\]\?!\.,<>"_'éèàçùµ²%]+$/i), // à modifier lors du release , pass en strong password atm
  username: yup.string().required(),
  firstname: yup.string().required(),
  question: yup.string().required(),
  response: yup.string().required(),
})

exports.loginSchema = loginSchema;
exports.signupSchema = signupSchema;