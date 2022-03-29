// create the models to talk to the DB
require('../models/Workshop');
require('../models/Topic');
require('../models/User');

const mongoose = require('mongoose');

mongoose.set('returnOriginal', false);
/*GLOBAL VALIDATION*/
//mongoose.set('useFindAndModify', false); (version 5)
//(for version 6)
mongoose.set('runValidators', true);

mongoose.connect('mongodb://localhost:27017/workshopsDB');

mongoose.connection.on('connected', ()=>{
    console.log('connected');
});

mongoose.connection.on('error', error => {
    console.log(error.message);
});