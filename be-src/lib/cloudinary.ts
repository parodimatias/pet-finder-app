var cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "dbkof485s",
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARTY_SECRET,
  secure: true,
});
export { cloudinary };
