import express from "express";

let articlesInfo = [{
    name: 'learn-react',
    upvotes: 0,
    comments: [],
}, {
    name: 'learn-node',
    upvotes: 0,
    comments: [],
}, {
    name: 'mongodb',
    upvotes: 0,
    comments: [],
}]

const app = express();
app.use(express.json());

app.put('/api/articles/:articleId/upvote', (req, res) => {
    const { articleId } = req.params;
    const article = articlesInfo.find(a => a.name === articleId);
    if (article) {
    article.upvotes +=1;
    res.send(`The ${articleId} article now has ${article.upvotes} upvotes!!`);
    }else {
        res.send(`That article does not exist`);
    }
});

app.post('/api/articles/:articleId/comments', (req, res) => {
    const { postedBy, text } = req.body;
    const { articleId } = req.params;

    const article = articlesInfo.find(a => a.name === articleId);
    if (article) {
    article.comments.push({ postedBy, text });
    res.send(article.comments);
    }else {
        res.send(`That article does not exist`);
    }
})

// Params in requests
// app.get('/hello/:name/goodbye/:secondName', (req, res) => {
//     console.log(req.params); is going to give- { name: 'Marianne', secondName: 'Emma'} depending on value of params in the url
//     const { name } = req.params; this will pull name param from url
//     res.send(`Hello ${name}!!`); can than use value of name param in response
// })

app.listen(8000, () => {
    console.log("Server is listening on port 8000");
});

