const yup = require('yup');


const commentSchema = yup.object().shape({
  content: yup.string().required(),
  PostId: yup.number().required()
});

exports.commentSchema = commentSchema;