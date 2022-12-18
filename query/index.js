const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};


app.get('/posts', (req, res) => {
    res.send(posts);
    }
    );



app.post('/events', (req, res) => { 

    // On the query service, we need to keep track of all the events that have been received
    // Within req.body, we have the type of event and the data

    const {type, data} = req.body;

    // If the event is a PostCreated event, we need to add the post to the posts object
    if (type === 'PostCreated') {
        const {id, title} = data;

        // Add the post to the posts object
        posts[id] = {id, title, comments: []};
    }

    // If the event is a CommentCreated event, we need to add the comment to the comments array
    if (type === 'CommentCreated') {
        const {id, content, postId} = data;
        
        // Get the post that the comment belongs to
        const post = posts[postId];
        post.comments.push({id, content}); // Add the comment to the comments array
    }

    console.log(posts);

    res.send({});
    }
    );


    

app.listen(4002, () => {
    console.log('Listening on 4002');
    }

    );


