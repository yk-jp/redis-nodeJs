const express = require('express');
const app = express();

app.use(express.json());

// redis
const redis = require("redis");
const redisDefaultUrl = "redis://127.0.0.1:6379";
const client = redis.createClient(redisDefaultUrl);


client.on("error", function(error) {
    console.error(error);
});

app.listen('3000', () => {
    console.log('server is listening on port 3000');
})