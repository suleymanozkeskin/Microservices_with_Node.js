const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};


const handleEvent = (type, data) => {
        // If the event is a PostCreated event, we need to add the post to the posts object
        if (type === 'PostCreated') {
            const {id, title} = data;
    
            // Add the post to the posts object
            posts[id] = {id, title, comments: []};
        }
    
        // If the event is a CommentCreated event, we need to add the comment to the comments array
        if (type === 'CommentCreated') {
            const {id, content, postId,status} = data;
            
            // Get the post that the comment belongs to
            const post = posts[postId];
            post.comments.push({id, content,status}); // Add the comment to the comments array
        }
    
    
        if (type === 'CommentUpdated') {
            const {id, content, postId, status} = data;
            
            // Get the post that the comment belongs to
            const post = posts[postId];
            // Get the comment that needs to be updated
            const comment = post.comments.find(comment => {
                return comment.id === id;
            });
    
            // Update the comment
            comment.status = status;
            comment.content = content;
        }
    };



app.get('/posts', (req, res) => {
    res.send(posts);
    }
    );



app.post('/events', (req, res) => { 

    // On the query service, we need to keep track of all the events that have been received
    // Within req.body, we have the type of event and the data

    const {type, data} = req.body;

    handleEvent(type, data);

    res.send({});
    }
    );


    

app.listen(4002, async () => {
    console.log('Listening on 4002');
    
    // When the query service starts up, we need to query the event bus for all the events that have been emitted
    const res = await axios.get('http://localhost:4005/events');

    // Loop through all the events and call the handleEvent function for each event
    for (let event of res.data) {
        console.log('Processing event:', event.type);

        handleEvent(event.type, event.data);
    }
    }
    );

   

//       });



   

