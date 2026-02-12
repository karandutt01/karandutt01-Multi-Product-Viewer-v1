require('dotenv').config();
const express = require('express');
const app = express();

const cors = require('cors');
const bodyParser = require("body-parser");
const port  =  process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json())


app.listen(port, () => {
    console.log('Server runnning on port ' + port)
})