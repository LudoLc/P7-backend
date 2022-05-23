const fs = require("fs");
const multer = require("multer");

const MIME_TYPES = {
  //mimetype: 'image/png',
  'image/jpg': 'jpg',
  'image/jpeg': 'jpeg',
  'image/png': 'png',
  'image/bmp': 'bmp',
  'image/svg': 'svg',
  'image/gif': 'gif',
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./public/images");
  },
  filename: (req, file, callback) => {
    const decodedToken = req.state.get("TOKEN");
    // permet de recuperer l'id de l'utilisateur , on genere le nom du fichier , et si ce fichier n'existe pas alors ==> creation.
    const userId = decodedToken.id;
    //JSON.parse(req.body.post).userId;
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    if(extension === undefined){
      throw new Error({error: "Format non autorisé!"})
    };
    const filename = name.replace(extension, "") + userId + "." + extension;
    callback(null, filename);
  },
});


module.exports = multer({ storage }).single("image");
