const express = require('express');
const bodyParser = require('body-parser');
const {randomBytes} = require('crypto');
const cors = require('cors');

const axios = require('axios');


const app = express();
app.use(bodyParser.json());
app.use(cors());


const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts);
    }
    );


app.post('/posts', async (req, res) => {
    // Generate a random id
    const id = randomBytes(4).toString('hex');
    // Get the title from the request body
    const {title} = req.body;
    // Add the post to the posts object
    posts[id] = {id, title};
    // Notify the event bus that a post has been created
    await    axios.post('http://localhost:4005/events', {
        type: 'PostCreated',
        data: {id, title}
    });

    // Send the response
    res.status(201).send(posts[id]);
    }
);



app.post('/events', (req, res) => { 
    console.log('Received Event', req.body.type);

    res.send({});

    }
    );

// Listen on port 4000
app.listen(4000, () => {
    console.log('Listening on http://localhost:4000');
    }
);
