const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const orgLevelModel = require('../models/EntityModels/organizationalLevelModel');
const categoryModel = require('../models/EntityModels/categoryModel');
const targetModel = require('../models/EntityModels/targetModel');

const levels = [
    {
        name: "Support staff",
        type: 1
    },
    {
        name: "Staff",
        type: 2
    },
    {
        name: "Supervisor",
        type: 3
    },
    {
        name: "Middle Management",
        type: 4
    },
    {
        name: "Executive",
        type: 5
    }
]
orgLevelModel.insertMany(levels);

const surveyTarget = [
    {
        name: "Entire Organisation",
        type: 1
    },
    {
        name: "Executive",
        type: 2
    },
    {
        name: "Supervisor",
        type: 3
    },
    {
        name: "Middle management",
        type: 4
    },
    {
        name: "General staff",
        type: 5
    }];
targetModel.insertMany(surveyTarget);

const category = [
    {
        name: "Leadership",
        type: 1
    },
    {
        name: "Culture",
        type: 2
    },
    {
        name: "Talent",
        type: 3
    },
    {
        name: "Human experience",
        type: 4
    },
    {
        name: "Strategy alignment",
        type: 5
    },
    {
        name: "culture",
        type: 6
    }
]
categoryModel.insertMany(category);

