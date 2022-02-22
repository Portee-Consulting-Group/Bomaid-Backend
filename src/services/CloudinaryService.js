const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const uploadkycImage = async (image) => {
    try {
        let result = await cloudinary.uploader.upload(image, { folder: 'kyc_images' });
        return result;
    } catch (err) {
        throw err;
    }
};

const uploadProductImage = async (image) => {
    try {
        let result = await cloudinary.uploader.upload(image, { folder: 'product_images' });
        return result;
    } catch (error) {
        throw err;
    }
}


module.exports = {
    uploadkycImage,
    uploadProductImage
};