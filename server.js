const dotenv = require('dotenv');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const usersRoutes = require('./routes/users');
const postsRoutes = require('./routes/posts');

const app = express();

dotenv.config();
app.use(express.json());
app.use(cors());

app.use('/users', usersRoutes);
app.use('/posts', postsRoutes);

const CONNECTION_URL = process.env.CONNECTION_URL;
const PORT = process.env.PORT || 3000;

mongoose.connect(CONNECTION_URL, 
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(() => app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`)))
    .catch((error) => console.log(`Server did not connect sucessfully - ${error}`))