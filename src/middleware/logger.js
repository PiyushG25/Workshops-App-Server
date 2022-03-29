/*const logger = (req, res, next) => {
    //executes BEFORE response is sent
    const receiveDate = new Date();
    console.log('Request has been received at '+receiveDate.toTimeString());

    //transfer control to the next middleware
    next();

    //executes AFTER response is sent
    const responseDate = new Date();
    console.log('Response being sent at '+responseDate.toTimeString());

    console.log('miliseconds taken for processing this request = ',responseDate.getTime() - receiveDate.getTime());
};

module.exports = logger;*/