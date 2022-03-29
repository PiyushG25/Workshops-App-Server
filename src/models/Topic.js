const mongoose = require( 'mongoose' );

const topicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    speaker: {
        type: String,
        required: true
    }
});

mongoose.model( 'Topic', topicSchema );