const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const uploadUserGoalImage = async (image) => {
    try {
        let result = await cloudinary.uploader.upload(image, { folder: 'bomaid_user_goal_images' });
        return result;
    } catch (error) {
        throw err;
    }
}

const uploadGoalTypeImage = async (image) => {
    try {
        let result = await cloudinary.uploader.upload(image, { folder: 'bomaid_goal_type_images' });
        return result;
    } catch (error) {
        throw err;
    }
}
const uploadProfileImage = async (image) => {
    try {
        let result = await cloudinary.uploader.upload(image, { folder: 'bomaid_profile_images' });
        return result;
    } catch (error) {
        throw err;
    }
}
const uploadCircleImage = async (image) => {
    try {
        let result = await cloudinary.uploader.upload(image, { folder: 'bomaid_circle_images' });
        return result;
    } catch (error) {
        throw err;
    }
}

const uploadFitImage = async (image) => {
    try {
        let result = await cloudinary.uploader.upload(image, { folder: 'bomaid_fit_images' });
        return result;
    } catch (error) {
        throw err;
    }
}

const uploadChallengeImage = async (image) => {
    try {
        let result = await cloudinary.uploader.upload(image, { folder: 'bomaid_challenge_images' });
        return result;
    } catch (error) {
        throw err;
    }
}




module.exports = {
    uploadUserGoalImage,
    uploadGoalTypeImage,
    uploadProfileImage,
    uploadCircleImage,
    uploadFitImage,
    uploadChallengeImage
};