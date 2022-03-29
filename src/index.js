//run the init file which sets up DB connection
require('./data/init');

const express = require('express');
//const logger = require('./middleware/logger.js');
//const indexRouter = require('./routes/index');
const workshopsRouter = require('./routes/workshops');
const workshopsModesRouter = require('./routes/workshop-modes');
const topicsRouter = require('./routes/topics');
const authRouter = require('./routes/auth');

const {pageNotFound, apiNotFound} = require('./middleware/not-found');
const errorHandler = require('./middleware/error');
const cors = require('cors');

// This creates an Express application object - this includes an HTTP server
const app = express();

app.use(cors());

// middleware 1 - log request and response sent and total time fro processing
//app.use(logger);

// built-in Express middleware
// Set up form data on req.body
app.use(express.urlencoded({extended:false}));
// Set up JSON data sent using Ajax on req.body
app.use(express.json());

// set up index router to take care of routing to home page
// middleware 4
//app.use( indexRouter);
app.use('/workshops', workshopsRouter);
app.use('/workshops', workshopsModesRouter);
app.use('/topics', topicsRouter);
app.use('/auth', authRouter);

//ERROR handlers
//The error middleware MUST be at the very end
app.use('/workshops/:id/', pageNotFound);
app.use(apiNotFound);

//Generic Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, error => {
    if(error) {
        console.log(error);
        return;
    }
    console.log(`Check http://localhost:${PORT}`);
});
