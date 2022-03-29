const workshops = require('../data/workshops.json');

// http://localhost:3000/workshops?sort=name
//http://localhost:3000/workshops?sort=name&order=desc
const getWorkshops = (req, res, next) => {
    const { sort, order } = req.query;

    //sort the array
    workshops.sort((w1,w2) => {
        if (w1[sort]<w2[sort]){
            return order === 'asc'? -1 : 1;
        }
        if (w1[sort]>w2[sort]){
            return order === 'asc' ? 1 : -1;
        }
        return 0;
    });

    res.status(200);
    res.json(workshops);
};

const getWorkshopById = (req, res, next) => {
    let {id} = req.params;
    id= parseInt(id);

    //check if workshop id is a number
    if(isNaN(id)) {
        const error = new Error ("Workshop id must be a number");
        error.status = 400;
        next(error);
        return;
    }

    //check if workshop is available
    const match = workshops.find(workshop => id === workshop.id)

    if(!match){
        const error = new Error ("Workshop with given id does not exist");
        error.status = 404;
        next(error);
        return;
    }

    //res.status(200);
    res.json(match);
}

module.exports = {
    getWorkshops,
    getWorkshopById
};