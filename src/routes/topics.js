const express = require('express');
const {
    getTopics,
    getTopicById
} = require('../controllers/topics');

const router = express.Router();

router.get('/', getTopics);
router.get('/:id', getTopicById);

module.exports = router;