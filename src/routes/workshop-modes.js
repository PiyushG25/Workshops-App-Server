const express = require('express');
const {
    getModesForWorkshop,
    postModeForWorkshop
} = require('../controllers/workshops-modes');

const router = express.Router();

router.get('/:id/modes', getModesForWorkshop);
router.post('/:id/modes', postModeForWorkshop);

module.exports = router;