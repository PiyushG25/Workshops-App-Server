const mongoose = require( 'mongoose' );
const locationSchema = require('./Location');

const workshopSchema = new mongoose.Schema({
    topicIds: {
        type: [ mongoose.Schema.Types.ObjectId ],
        ref: 'Topic',
        default: [] // set to an empty array if topicIds is not passed
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        default: ''
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    location: {
        type: locationSchema,
        _id: false
    },
    modes : {
        type: [ String ],
    },
    imageUrl: String
});

// Mongoose generates a Model called Workshop - a class with methods to make DB queries to a `workshops` collection
mongoose.model( 'Workshop', workshopSchema );