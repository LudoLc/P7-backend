const yup = require('yup');


const commentSchema = yup.object().shape({
  content: yup.string().required(),
  userId: yup.number().required(),
  postId: yup.number().required(),
  media: yup.string().required(),
});

exports.commentSchema = commentSchema;