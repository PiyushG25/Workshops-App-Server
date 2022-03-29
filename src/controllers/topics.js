const mongoose = require('mongoose');
const Topic = mongoose.model('Topic');

const getTopics = async (req, res, next) => {
    try {
        const topics = await Topic.find();
        res.status(200).json(topics);
    } catch(error) {
        error.status = 500;
        return next(error);
    }
};

const getTopicById = async(req, res, next) => {
    let { id } = req.params;

    if(id.length!==24) {
        const error = new Error('Invalid Topic ID');
        error.status = 400; //bad request
        next(error);
        return;
    }

    try{
        const match = await Topic.findById(id);

        if(!match) {
            const error = new Error('Topic with given ID does not exist');
            error.status = 404;
            next(error);
            return;
        }

        res.json(match);
    } catch(error) {
        error.status = 500;
        return next(error);
    }
};

module.exports = {
    getTopics,
    getTopicById
}