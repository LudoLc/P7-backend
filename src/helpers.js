// fonction a rappeler :

function yupErrorToJson(validateErrors){
  const errors = {}
  for(const validateError of validateErrors.inner){
    if(!(validateError.path in errors)) errors[validateError.path] = []
    errors[validateError.path].push(validateError.message)
  }
  return errors
}

exports.yupErrorToJson = yupErrorToJson;