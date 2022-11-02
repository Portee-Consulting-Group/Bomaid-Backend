const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const statusEnum = require('../../common/enum').getStatusEnum();

const permissionSchema = new Schema({
    userId: { type: String, required: true, unique: true},
    emailNotifications: { type: Boolean, default: false },
    activityReminder: { type: Boolean, default: false },
    wellnessRecommendations: { type: Boolean, default: false },
    friendsActivity: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Permission = mongoose.model('Permissions', permissionSchema);

add = async (data) => {
    const permissions = new Permission(data);
    await permissions.save();
    return permissions;
};

update = async (query, data) => {
    return Permission.findOneAndUpdate(query, data, { new: true });
};

find = async (query) => {
    return Permission.findOne(query);
};

getPermissions = async (query, page, pageSize) => {
    return Permission.find(query)
        .sort({ _id: -1 })
        .skip(page)
        .limit(pageSize);
};

getActiveTypes = async () => {
    return Permission.find(e => e.status == statusEnum.active.value);
};

module.exports = {
    add,
    update,
    find,
    getPermissions,
    getActiveTypes
}