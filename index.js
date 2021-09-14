const express = require('express');
const util = require('util');
const axios = require('axios');
const app = express();

app.use(express.json());

// redis
const redis = require("redis");
const redisDefaultUrl = "redis://127.0.0.1:6379";
const client = redis.createClient(redisDefaultUrl);

client.set = util.promisify(client.set);
client.get = util.promisify(client.get);

client.on("error", (error) => {
    console.error(error);
});

app.post('/', async(req, res) => {
    const { key, value } = req.body;
    const response = await client.set(key, value);
    res.json(response);
})

app.get('/', async(req, res) => {
    const { key } = req.body;
    const value = await client.get(key);
    res.json(value);
})

app.get("/posts/:id", async(req, res) => {
    const id = req.params.id;

    const cachedPost = await client.get(id);

    if (cachedPost) return res.json(JSON.parse(cachedPost));

    const response = await axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`);
    client.set(id, JSON.stringify(response.data));

    return res.json(response.data);

})

app.listen('3000', () => {
    console.log('server is listening on port 3000');
})