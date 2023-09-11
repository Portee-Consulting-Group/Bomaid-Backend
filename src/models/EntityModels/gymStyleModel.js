const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const statusEnum = require('../../common/enum').getStatusEnum();

const feedSchema = new Schema({
    username: { type: String, default: "" },
    goalName: { type: String, default: "" },
    like: { type: Number, default: 0 },
    userId: { type: String, required: true },
    uploadUrl: { type: String, default: "" },
    uploadId: { type: String, default: "" },
    status: { type: Number, default: statusEnum.active.value },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Feed = mongoose.model('Feeds', feedSchema);


add = async (data) => {
    const feed = new Feed(data);
    await feed.save();
    return feed;
};

update = async (query, data) => {
    return Feed.findOneAndUpdate(query, data, { new: true });
};

find = async (query) => {
    return Feed.findOne(query);
};

findAll = async (query) => {
    return Feed.find(query);
};

getFeeds = async (query, page, pageSize) => {
    return Feed.find(query)
        .sort({ createdAt: 'desc' })
        .skip(page)
        .limit(pageSize);
};

module.exports = {
    add,
    update,
    find,
    findAll,
    getFeeds
}