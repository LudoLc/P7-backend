// fonction a rappeler :
// on recupere une erreur provenant de yup , et on la transforme en un objet auquel dedans on injecte un message d'erreur qui est specifique à une erreur donnée
// quand l'erreur vient a se produire alors on peut voir le message de l'erreur qui sera définit !  
function yupErrorToJson(validateErrors){
  const errors = {}
  for(const validateError of validateErrors.inner){
    if(!(validateError.path in errors)) errors[validateError.path] = []
    errors[validateError.path].push(validateError.message)
  }
  return errors
}

exports.yupErrorToJson = yupErrorToJson;