import express from "express";
import { MongoClient } from 'mongodb';

const app = express();
app.use(express.json());

app.get('/api/articles/:name', async (req, res) => {
    const { name } = req.params;

    const client = new MongoClient('mongodb://127.0.0.1:27017');
    await client.connect();

    const db = client.db('react-blog-db');

    const article = await db.collection('articles').findOne({ name });

    res.json(article);
})

app.put('/api/articles/:name/upvote', (req, res) => {
    const { name } = req.params;
    const article = articlesInfo.find(a => a.name === name);
    if (article) {
    article.upvotes +=1;
    res.send(`The ${name} article now has ${article.upvotes} upvotes!!`);
    }else {
        res.send(`That article does not exist`);
    }
});

app.post('/api/articles/:name/comments', (req, res) => {
    const { postedBy, text } = req.body;
    const { name } = req.params;

    const article = articlesInfo.find(a => a.name === name);
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

