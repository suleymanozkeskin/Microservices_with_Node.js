const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());



// Lets create an event bus that will listen to events from the posts service and then forward them to the other services. This will allow us to decouple the services from each other. This will also allow us to add new services without having to change the existing services.
// We will add error handling to the event bus so that if one of the services is down, the event bus will not crash. We will also add a status endpoint to the event bus so that we can check if the event bus is up and running.
// In cases where errors are not catched , there is good chance that nodemon will crash.

app.post("/events", (req, res) => {
  const event = req.body;

  axios.post("http://localhost:4000/events", event).catch((err) => {
    console.log(err.message);
  });
  axios.post("http://localhost:4001/events", event).catch((err) => {
    console.log(err.message);
  });
  axios.post("http://localhost:4002/events", event).catch((err) => {
    console.log(err.message);
  });
  res.send({ status: "OK" });
});

app.listen(4005, () => {
  console.log("Listening on 4005");
});