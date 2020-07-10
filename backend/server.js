const express = require("express");
const axios = require("axios");

const app = express();

const PORT = process.env.PORT || 3000;

const { makeHandleTags: makeTagsHandler } = require("./middleware/handleTagSearch");
const { handleSort: sortHandler } = require("./middleware/handleSort"); 

app.get("/api/posts", [makeTagsHandler(axios), sortHandler], (req, res) => {
    res.json({ posts: req.foundPosts });
});

app.get("/api/ping", (req, res) => {
    res.json({
        success: true
    });
});

const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}`)
});