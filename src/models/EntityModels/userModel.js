const mongoose = require('mongoose');
const statusEnum = require('../../common/enum').getStatusEnum();
const Schema = mongoose.Schema;
const fuzzySearching = require('mongoose-fuzzy-searching');
const userEnum = require('../../common/enum').getUserEnum();


const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, match: /.+\@.+\..+/, unique: true, lowercase: true },
    password: { type: String, required: true, },
    uploadUrl: { type: String, default: "" },
    uploadId: { type: String, default: "" },
    accountType: { type: Number, default: 0 },
    orgLevel: { type: Number, default: 0 },
    userTypeId: { type: String, required: true, default: userEnum.user.value },
    // callingCodeId: { type: String, required: true },
    // phoneNo: { type: String, required: true, unique: true },
    companyRole: { type: String, required: true},
    dateOfBirth: { type: Date, default: "" },
    genderType: { type: Number, default: 0 },
    status: { type: Number, default: statusEnum.inactive.value },
    token: { type: String, default: "" },
    weight: { type: String, default: "" },
    height: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

userSchema.plugin(fuzzySearching, { fields: ['firstName', 'lastName', 'username'] })
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


getActiveUsers = async (page, pageSize) => {
    return User.find({ status: statusEnum.active.value }, { __v: 0, password: 0 })
        .sort({ _id: -1 })
        .skip(page)
        .limit(pageSize);
};


module.exports = {
    add,
    update,
    find,
    findAll,
    getActiveUsers
}