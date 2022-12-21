const express    = require('express');
const bodyParser = require('body-parser');
const {randomBytes} = require('crypto');
const cors       = require('cors');

const axios = require('axios'); 

const app = express();

app.use(bodyParser.json());
app.use(cors());

const commentsbyPostId = {};


// Get all the comments for a post
app.get('/posts/:id/comments', (req, res) => {

    res.send(commentsbyPostId[req.params.id] || []); // If there are no comments for this post, return an empty array
    }
);


app.post('/posts/:id/comments', async (req, res) => {
    
    const commentId = randomBytes(4).toString('hex'); // Generate a random id
    
    const {content} = req.body; // Get the content from the request body
    
    const comments = commentsbyPostId[req.params.id] || []; // If there are no comments for this post, create an empty array
    
    comments.push({ id: commentId, content,status: "pending"}); // Add the comment to the array
    
    commentsbyPostId[req.params.id] = comments; // Add the comments to the commentsbyPostId object

    await axios.post('http://localhost:4005/events', { // Notify the event bus that a comment has been created
        type: 'CommentCreated',
        data: {
            id: commentId,
            content,
            postId: req.params.id,
            status: "pending"} // Send the comment id, content and post id that the comment belongs to
    });

    
    res.status(201).send(comments); // Send the response
    }
);



// Receive events from the event bus
app.post("/events", async (req, res) => {
    console.log("Event Received:", req.body.type);
  
    const { type, data } = req.body;
  
    if (type === "CommentModerated") {
      const { postId, id, status, content } = data;
      const comments = commentsbyPostId[postId];
  
      const comment = comments.find((comment) => {
        return comment.id === id;
      });
      comment.status = status;
  
      await axios.post("http://localhost:4005/events", {
        type: "CommentUpdated",
        data: {
          id,
          status,
          postId,
          content,
        },
      });
    }
  
    res.send({});
  });


// Since we are using the same port as the posts service, we need to change the port number to 4001
app.listen(4001, () => {
    console.log('Listening on http://localhost:4001');
    }
);


