const yup = require("yup");

const postSchema = yup.object().shape({
  content: yup.string().required(),
  title: yup.string().required(),
});

exports.postSchema = postSchema;
