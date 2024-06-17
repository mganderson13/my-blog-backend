import express from "express";
import fs from "fs";
import admin from "firebase-admin";
import { db, connectToDb } from './db.js';

const credentials = JSON.parse(
    fs.readFileSync('../credentials.json')
);
admin.initializeApp({
    credential: admin.credential.cert(credentials),
});

const app = express();
app.use(express.json());

app.use(async (req, res, next) => {
    const { authtoken } = req.headers;

    if (authtoken) {
        try {
            req.user = await admin.auth().verifyIdToken(authtoken);
        } catch (e) {
            res.sendStatus(400);
        }
    }

    next();
});

app.get('/api/articles/:name', async (req, res) => {
    const { name } = req.params;

    const article = await db.collection('articles').findOne({ name });

    if (article) {
        res.json(article);
    }else {
        res.sendStatus(404);
    }
})

app.put('/api/articles/:name/upvote', async (req, res) => {
    const { name } = req.params;

    await db.collection('articles').updateOne({ name }, {
        $inc: { upvotes: 1 },
    });

    const article = await db.collection('articles').findOne({ name });

    if (article) {
        res.json(article);
    }else {
        res.send(`That article does not exist`);
    }
});

app.post('/api/articles/:name/comments', async (req, res) => {
    const { postedBy, text } = req.body;
    const { name } = req.params;

    await db.collection('articles').updateOne({ name }, {
        $push: { comments: { postedBy, text } },
    });

    const article = await db.collection('articles').findOne({ name });

    if (article) {
    res.json(article);
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

connectToDb(() => {
    console.log('Successfully connected to database')
app.listen(8000, () => {
    console.log("Server is listening on port 8000");
});
});
