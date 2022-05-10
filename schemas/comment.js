const yup = require('yup');


const commentSchema = yup.object().shape({
  content: yup.string().required(),
  title: yup.string().required
});

exports.commentSchema = commentSchema;