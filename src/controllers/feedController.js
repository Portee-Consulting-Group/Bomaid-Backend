const { AlreadyExistsException, NotFoundException, NullReferenceException } = require('../../errors/AppError');
const { status } = require('../common/status');
const FeedModel = require('../models/EntityModels/feedModel');
const UserModel = require('../models/EntityModels/userModel');
const SuccessResponse = require('../models/viewModels/responseModel');
const clodinaryService = require('../services/CloudinaryService');


addFeed = async (req, res) => {
    try {
        let user = await UserModel.find({ userId: req.body.userId });
        if (user == null) throw new NotFoundException("User not found");
        if (req.body.feedImage != undefined) {
            const uploadedImage = await clodinaryService.uploadFeedImage(req.body.feedImage);
            req.body.uploadUrl = uploadedImage.url;
            req.body.uploadId = uploadedImage.public_id;
        }
        type = await FeedModel.add(req.body);
        let response = new SuccessResponse(type, "feed added");
        res.status(status.SUCCESS).json(response);
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
};

likeFeed = async (req, res) => {
    try {
        let feed = await FeedModel.find({ _id: req.params.feedId });
        if (feed == null) throw new NullReferenceException("Feed not found");
        const result = req.params.like.toLowerCase();
        if (result === 'true') {
            feed = await FeedModel.update({ _id: req.params.feedId }, {
                like: ++feed.like
            });
        } else {
            if (feed.like > 0) {
                feed = await FeedModel.update({ _id: req.params.feedId }, {
                    like: --feed.like
                });
            }
        }
        let response = new SuccessResponse(feed, "like updated");
        res.status(status.SUCCESS).json(response);
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
}

getUserFeeds = async (req, res) => {
    try {
        var types = await FeedModel.getFeeds({ userId: req.params.userId }, req.page, req.pageSize);
        let response = new SuccessResponse(types, "feeds")
        res.status(status.SUCCESS).json(response);
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
};

getFeeds = async (req, res) => {
    try {
        var types = await FeedModel.getFeeds({}, req.page, req.pageSize);
        let response = new SuccessResponse(types, "feeds")
        res.status(status.SUCCESS).json(response);
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
};

module.exports = {
    addFeed,
    likeFeed,
    getUserFeeds,
    getFeeds
}