const mongoose = require('mongoose');
const statusEnum = require('../../common/enum').getStatusEnum();
const Schema = mongoose.Schema;
const { DEFAULT_PIC_ID, DEFAULT_PIC_URL } = require('../../common/constants');
const userEnum = require('../../common/enum').getUserEnum();


const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, match: /.+\@.+\..+/, unique: true, lowercase: true },
    password: { type: String, required: true, },
    uploadUrl: { type: String, default: DEFAULT_PIC_URL },
    uploadId: { type: String, default: DEFAULT_PIC_ID },
    accountType: { type: Number, default: 0 },
    orgLevel: { type: Number, required:true },
    userTypeId: { type: String, required: true, default: userEnum.user.value },
    // callingCodeId: { type: String, required: true },
    // phoneNo: { type: String, required: true, unique: true },
    companyRole: { type: String, required: true},
    dateOfBirth: { type: Date, default: "" },
    genderType: { type: Number, default: 0 },
    status: { type: Number, default: statusEnum.active.value },
    token: { type: String, default: "" },
    weight: { type: String, default: "" },
    height: { type: String, default: "" },
    garminUserToken: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.models.Users || mongoose.model('Users', userSchema);

add = async (data) => {
    const user = new User(data);
    await user.save();
    return user;
};

update = async (query, data) => {
    return User.findOneAndUpdate(query, data, { new: true });;
};

find = async (query) => {
    return User.findOne(query);
};
findAll = async (query) => {
    return User.find(query);
};

getAll = async ()=>{
    return User.find({})
}


getActiveUsers = async (page, pageSize) => {
    return User.find({ status: statusEnum.active.value }, { __v: 0, password: 0 })
        .sort({ _id: -1 })
        .skip(page)
        .limit(pageSize);
};

deleteAccount = async (userId) => {
    await User.findByIdAndDelete(userId)
}

module.exports = {
    add,
    update,
    find,
    getAll,
    findAll,
    getActiveUsers,
    deleteAccount,
    User
}