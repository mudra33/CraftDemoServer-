require('dotenv').config();
const express = require('express');
const dbConnect = require('./dbConnect');
const accountRoutes = require('./api/routes');
const cors = require('cors');
const app = express();

dbConnect();

app.use(express.json());
app.use(cors());

app.use('/api', accountRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));
module.exports = app;
