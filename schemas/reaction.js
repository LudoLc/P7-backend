const yup = require("yup");

const reactionSchema = yup.object().shape({
  type: yup.number(),
  PostId: yup.number().required()
});

exports.reactionSchema = reactionSchema;
