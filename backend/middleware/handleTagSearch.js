const cachedResult = {};
let dataFetchingLibrary;

// dep-inject to make testing easier for data fetch
function makeHandleTags(library) {
    dataFetchingLibrary = library;
    return handleTags;
}

async function handleTags(req, res, next) {
    const { tags } = req.query;
    const paramError = checkParamError(tags);
    if (paramError instanceof Error) {
        next(paramError);
        return
    }
    const cleanTagsString = tags.replace(/\s/g,""); //remove all spaces
    const tagsArray = cleanTagsString.split(",");

    const result = await getResultsForAllTags(dataFetchingLibrary.get, tagsArray);

    req.foundPosts = mergeUniquePost(result);
    next();
}

function checkParamError (tags) {
    // return an error when there is no tag provided by client
    if (!tags) {
        const errorMessage = JSON.stringify({ 
            status: 400, 
            message: "Tags parameter is required" 
        });
        return new Error(errorMessage);
    }

    return null;
}

async function getResultsForAllTags(fetchFunction, tagsArray) {
    // fetch for posts by tags in parallel, wait til all requests are completed with Promise.all
    return await Promise.all(tagsArray.map(tag => {
        if (cachedResult[tag]) {
            // use cached data if data was previously retrieved
            return Promise.resolve(cachedResult[tag]);
        }
        return fetchAndCacheResultFromAPI(fetchFunction, tag);
    }));
}

function mergeUniquePost(postsListByTag) {
    const uniquePostIDs = new Set();
    const mergedPosts = [];
    for (postsList of postsListByTag) {
        for (post of postsList) {
            if (!uniquePostIDs.has(post.id)) {
                uniquePostIDs.add(post.id);
                mergedPosts.push(post);
            }
        }
    }
    return mergedPosts;
}

function fetchAndCacheResultFromAPI(
    fetchFunction, 
    searchTerm, 
    paramName="tag",
    APIroute="https://hatchways.io/api/assessment/blog/posts") {
    // if 3-rd party API later changes (eg upgrade to v2), we can still potentially update path 
    // by overriding with env variable to accomdate, without having updating our server code
    const url = process.env.API_route || APIroute
    const query = process.env.API_route_param_name || paramName

    return new Promise(async (resolve, reject) => {
        try {
            const { data: { posts } } = await fetchFunction(`${url}?${query}=${searchTerm}`);
            cachedResult[searchTerm] = posts;
            resolve(posts);
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    makeHandleTags,
    handleTags,
    checkParamError,
    getResultsForAllTags,
    mergeUniquePost,
    fetchAndCacheResultFromAPI,
}