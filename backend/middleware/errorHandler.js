module.exports = function handleClientError(error, req, res, next) {
    try {
        const { status, message } = JSON.parse(error.message);
        res.status(status || 400).json(message);
    } catch (e) {
        // catch all
        console.log(e); //unhandled error logging
        res.status(500).json("Internal Server Error.")
    }
}