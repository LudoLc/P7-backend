const yup = require("yup");

const postSchema = yup.object().shape({
  content: yup.string().required(),
  image: yup.mixed(),
});

exports.postSchema = postSchema;
