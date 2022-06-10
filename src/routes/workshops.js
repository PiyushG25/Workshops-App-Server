const express = require( 'express' );
const workshops = require('../data/workshops.json');
const { 
    getWorkshops, 
    getWorkshopById, 
    postWorkshop,
    patchWorkshopById,
    deleteWorkshopById,
    getTopicsByWorkshopId,
    postTopicForWorkshopWithId
} = require('../controllers/workshops');

const {authenticate, authorize} = require('../middleware/auth');

const router = express.Router();

router.get('/' , authenticate, getWorkshops);
router.get('/:id',getWorkshopById);
router.post('/', authenticate ,postWorkshop);
router.patch('/:id', authenticate ,patchWorkshopById);
router.delete('/:id', authenticate, authorize(["admin"]), deleteWorkshopById);

router.get('/:id/topics', getTopicsByWorkshopId);
router.post('/:id/topics', authenticate ,postTopicForWorkshopWithId);



module.exports = router;