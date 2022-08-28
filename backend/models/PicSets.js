const mongoose = require("mongoose")

const picSetsSchema  = new mongoose.Schema({
    picsetName: {type: String, require: true},
    createRole: {type: String, require: true},
    notes: String,
    createdOn: Number,
    id: String
})

const PicSetsModel = mongoose.model('picSets', picSetsSchema)

module.exports = PicSetsModel