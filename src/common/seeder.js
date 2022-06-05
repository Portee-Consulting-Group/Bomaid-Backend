const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const orgLevelModel = require('../models/EntityModels/organizationalLevelModel');

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
