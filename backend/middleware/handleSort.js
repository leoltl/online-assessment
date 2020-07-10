const VALID_SORTBY = new Set([ "id", "reads", "likes", "popularity"]);
const VALID_DIRECTION = new Set(["desc", "asc"]);

function handleSort(req, res, next) {
    const { sortBy="id", direction="asc" } = req.query;

    const paramError = checkParamsError(sortBy, direction)
    if (paramError instanceof Error) {
        next(paramError);
        return
    }
    req.foundPosts = req.foundPosts.sort(makeSortFunction(sortBy, direction));
    next();
}

function checkParamsError(sortBy, direction) {
    const invalidSortBy = !VALID_SORTBY.has(sortBy);
    const invalidDirection = !VALID_DIRECTION.has(direction)

    if (invalidDirection || invalidSortBy) {
        const errorMessage = JSON.stringify({ 
            status: 400, 
            message: `${invalidSortBy ? "sortBy" : "direction"} parameter is invalid`
        })
        return new Error(errorMessage);
    }

    return null;
}

function makeSortFunction(sortBy, direction) {
    return function (a,b) {
        if (direction == "asc") {
            return parseFloat(a[sortBy]) - parseFloat(b[sortBy]) 
        }
        return parseFloat(b[sortBy]) - parseFloat(a[sortBy])
    }
}

module.exports = {
    handleSort,
    checkParamsError,
    makeSortFunction,
}