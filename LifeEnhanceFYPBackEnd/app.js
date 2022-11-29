//This creates the server
const express = require('express');
const app = express();


const fitnessDiaryRoute = require('./routes/fitnessDiary');
const cors = require("cors");

//Middlewares
app.use(cors());
app.use('/fitnessDiary',fitnessDiaryRoute);





app.listen(3001);

