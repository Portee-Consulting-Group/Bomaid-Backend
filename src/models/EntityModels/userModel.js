const mongoose = require('mongoose');
const statusEnum = require('../../common/enum').getStatusEnum();
const Schema = mongoose.Schema;
const fuzzySearching = require('mongoose-fuzzy-searching');


const userSchema = new Schema({
    firstName: { type: String, required: true, uppercase: true },
    lastName: { type: String, required: true, uppercase: true },
    email: { type: String, required: true, match: /.+\@.+\..+/, unique: true, lowercase: true },
    password: { type: String, required: true, },
    profilePicture: { type: String, default: "" },
    userTypeId: { type: String, required: true},
    callingCodeId: { type: String, required: true},
    phoneNo: { type: String, required:true, unique: true},
    genderType: { type: Number, default: 0 },
    status: { type: Number, default: statusEnum.inactive.value },
    token: {type: String,  default: ""},
    createdAt: { type: Date, default: Date.now},
    updatedAt: { type: Date, default: Date.now}
});

userSchema.plugin(fuzzySearching, { fields: ['firstName', 'lastName', 'username'] })
const User = mongoose.model('Users', userSchema);

add = async (data) => {
    const user = new User(data);
    await user.save();
    return user;
};

update = async (query, data) => {
    return User.findOneAndUpdate(query, data, {new:true});;
};

find = async (query) => {
    return User.findOne(query);
};

getOne = async (query) => {

};

getActiveUsers = async (perPage, page) => {
    return User.find({ status: statusEnum.active.value }, { _id: 0, __v: 0, password: 0 })
        .sort({ _id: -1 })
        .skip(page)
        .limit(perPage);
};


module.exports = {
    add,
    update,
    find,
    getOne,
    getActiveUsers
}