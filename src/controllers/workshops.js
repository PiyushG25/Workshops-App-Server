//const workshops = require('../data/workshops.json');
const mongoose = require('mongoose');
const Workshop = mongoose.model('Workshop');
const Topic = mongoose.model('Topic');
const jwt = require('jsonwebtoken');
// Sample Queries
//http://localhost:3000/workshops?fields=startDate&sort=desc

// Let's say every page has 10 documents
//http://localhost:3000/workshops?page=1

const getWorkshops = async(req, res, next) => {
    const { claims } = res.locals;
    
    let { fields, sort, page } = req.query;
    page = parseInt(page);

    if(isNaN(page)){
        page =1;
    }
    const skip = (page - 1)*10;
    const limit = 10;

    let sortClause;
    if(sort === 'desc') {
        sortClause = {
            [fields] : -1 //startDate
        };
    } else {
        sortClause = {
            [fields] : 1
        }
    }

    try{
        const workshops = await Workshop.find().sort(sortClause).skip(skip).limit(limit);
        res.status(200).json(workshops);
    }    
    catch(error){
        error.status = 500;
        return next(error);
    }
};

const getWorkshopById = async(req, res, next) => {
    let {id} = req.params;

    //basic way to check length of an object id
    if(id.length!==24) {
        const error = new Error("Invalid Object ID");
        error.status = 400; // bad request
        next(error);
        return;
    }

    try{
        const match = await Workshop.findById(id);
 
        if(!match){
            const error = new Error ("Workshop with given id does not exist");
            error.status = 404;
            next(error);
            return;
        }

        //res.status(200);
        res.json(match);
    }
    catch(error){
        error.status= 500;
        return next(error);
    }
};

const postWorkshop = async (req, res, next) => {
    const workshop = req.body;
    
    try {
        const updatedWorkshop = await Workshop.create(workshop);
        res.json(updatedWorkshop);
    } catch (error) {
        // error could have occured due to
        //      1. DB issues (for example DB server not connected to etc.)
        //      2. Mongoose validation check failure
        
        // Case 2 (Mongoose validation check failure)
        if( error.name === 'ValidationError' ) {
            error.status = 400; // bad request as required fields are missing or not proeprly given
            return next( error )
        }

        error.status = 500;
        next(error);
    }
};

const patchWorkshopById = async (req, res, next) => {
    const { id } = req.params;
    const workshop = req.body;

        /*
    workshop = { 
        "location": {
            "address": "Dadar",
            "city": "Mumbai"
        }
    }
    */
    if( workshop.location ) {
        if( workshop.location.address ) {
            // workshop = { 
            //     "location": {
            //         "address": "Dadar",
            //         "city": "Mumbai"
            //     },
            //     "location.address": "Dadar"
            // }
            workshop["location.address"] = workshop.location.address;
        }

        if( workshop.location.city ) {
            workshop["location.city"] = workshop.location.city;
        }
       
        if( workshop.location.state ) {
            workshop["location.state"] = workshop.location.state;
        }

        // workshop = {
        //     "location.address": "Dadar",
        //     "location.city": "Mumbai"
        // };
        delete workshop.location;
    }

    try {
        const updatedWorkshop = await Workshop.findByIdAndUpdate(id, workshop, {new : true});
        /*LOCAL VALIDATION*/
        /*const updatedWorkshop = await Workshop.findByIdAndUpdate(id, workshop, {runValidators : true,
        returnOriginal : false});*/
        res.json(updatedWorkshop);
    } catch (error) {
        error.status = 500;
        next(error);
    }
};

const deleteWorkshopById = async(req, res, next) => {
    const { id } = req.params;

    try{
       const removed = await Workshop.findByIdAndDelete(id);
       if(!removed) {
           const error = new Error("Workshop not found");
           error.status = 404;
           return next (error);
       }
        res.status(204).send(); //204 -> success but nothing sent in response body
    } catch(error) {
        error.status=500;
        next(error);
    }
};

const getTopicsByWorkshopId = async ( req, res, next ) => {
    const { id } = req.params;

    try {
        // const workshop = await Workshop.findById( id ).select( { topicsIds : 1 } );
        // const topics = await Topic.find({
        //     _id: {
        //         $in: workshop.topicIds
        //     }
        // });

        // Hey Mongoose! Instead of returning array of ObjectId(s), please return the array of topics itself
        const workshop = await Workshop.findById( id ).select( { topicIds : 1 } ).populate( 'topicIds' );
        res.json( workshop.topicIds );
    } catch( error ) {
        error.status = 500;
        next( error );
    }
};

// We shall reset the topic
const postTopicForWorkshopWithId = async ( req, res, next ) => {
    const topic = req.body;
    const { id } = req.params;

    try {
        const createdTopic = await Topic.create( topic );
        
        const updateClause = {
            $push: {
                topicIds: createdTopic._id
            }
        };

        const updatedWorkshop = await Workshop.findByIdAndUpdate( id, updateClause );
        res.json( updatedWorkshop );
    } catch( error ) {
        error.status = 500;
        next( error );
    }
};

module.exports = {
    getWorkshops,
    getWorkshopById,
    postWorkshop,
    patchWorkshopById,
    deleteWorkshopById,
    getTopicsByWorkshopId,
    postTopicForWorkshopWithId
};