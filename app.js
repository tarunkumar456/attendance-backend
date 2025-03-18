const express = require('express')
const cookieparser = require('cookie-parser');
const cors = require('cors');
const app = express();
app.use(
    cors({
      origin: '*', // Allows all origins
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allows all HTTP methods
      allowedHeaders: '*', // Allows all headers
      credentials: true // If needed, but note that '*' and credentials: true can't be used together
    })
  );
app.use(cookieparser());

app.use(express.json());

const locationRoute = require('./routes/locationRoute');

app.use("/api/v1",locationRoute);

const errorMiddleware = require('./middleware/error')

//route import
const notes= require('./routes/userRoute');
app.use("/api/v1",notes);


//middleware for error
app.use(errorMiddleware);
module.exports = app;
