const pageNotFound = (req, res, next) => {
    res.json({
        status : 'error',
        message: 'Page Not Found'
    });
};

const apiNotFound = (req, res, next) => {
    const error = new Error('API endpoint not supported');
    error.status = 404;
    next(error);
};

module.exports ={
    pageNotFound,
    apiNotFound
}