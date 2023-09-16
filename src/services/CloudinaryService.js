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
    } catch (err) {
        throw err;
    }
}

const uploadGoalTypeImage = async (image) => {
    try {
        let result = await cloudinary.uploader.upload(image, { folder: 'bomaid_goal_type_images' });
        return result;
    } catch (err) {
        throw err;
    }
}
const uploadProfileImage = async (image) => {
    try {
        let result = await cloudinary.uploader.upload(image, { folder: 'bomaid_profile_images' });
        return result;
    } catch (err) {
        throw err;
    }
}
const uploadCircleImage = async (image) => {
    try {
        let result = await cloudinary.uploader.upload(image, { folder: 'bomaid_circle_images' });
        return result;
    } catch (err) {
        throw err;
    }
}

const uploadFitImage = async (image) => {
    try {
        let result = await cloudinary.uploader.upload(image, { folder: 'bomaid_fit_images' });
        return result;
    } catch (err) {
        throw err;
    }
}

const uploadChallengeImage = async (image) => {
    try {
        let result = await cloudinary.uploader.upload(image, { folder: 'bomaid_challenge_images' });
        return result;
    } catch (err) {
        throw err;
    }
}

const uploadChatFile = async (file)=> {
    try {
        let result = await cloudinary.uploader.upload(file, { folder: 'bomaid_chat_file' });
        return result;
    } catch (err) {
        throw err;
    }
}

const uploadFeedImage = async (file)=> {
    try {
        let result = await cloudinary.uploader.upload(file, { folder: 'bomaid_feed_file' });
        return result;
    } catch (err) {
        throw err;
    }
}
const uploadGroupImage = async (file)=> {
    try {
        let result = await cloudinary.uploader.upload(file, { folder: 'bomaid_group_file' });
        return result;
    } catch (err) {
        throw err;
    }
}

const uploadSwimStyleImage = async (file)=> {
    try {
        let result = await cloudinary.uploader.upload(file, { folder: 'bomaid_swim_style_file' });
        return result;
    } catch (err) {
        throw err;
    }
}

const uploadSwimProgramImage = async (file)=> {
    try {
        let result = await cloudinary.uploader.upload(file, { folder: 'bomaid_swim_program_file' });
        return result;
    } catch (err) {
        throw err;
    }
}

const uploadGymTargetBodyImage = async (file)=> {
    try {
        let result = await cloudinary.uploader.upload(file, { folder: 'bomaid_gym_target_body_program_file' });
        return result;
    } catch (err) {
        throw err;
    }
}

const uploadGymProgramImage = async (file)=> {
    try {
        let result = await cloudinary.uploader.upload(file, { folder: 'bomaid_gym_program_file' });
        return result;
    } catch (err) {
        throw err;
    }
}
const uploadGymExerciseImage = async (file)=> {
    try {
        let result = await cloudinary.uploader.upload(file, { folder: 'bomaid_gym_exercise_file' });
        return result;
    } catch (err) {
        throw err;
    }
}




module.exports = {
    uploadUserGoalImage,
    uploadGoalTypeImage,
    uploadProfileImage,
    uploadCircleImage,
    uploadFitImage,
    uploadChallengeImage,
    uploadChatFile,
    uploadFeedImage,
    uploadGroupImage,
    uploadSwimStyleImage,
    uploadSwimProgramImage,
    uploadGymTargetBodyImage,
    uploadGymProgramImage,
    uploadGymExerciseImage
};