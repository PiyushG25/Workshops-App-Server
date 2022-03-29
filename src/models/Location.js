const mongoose = require( 'mongoose' );

const locationSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: String
});

module.exports = locationSchema;