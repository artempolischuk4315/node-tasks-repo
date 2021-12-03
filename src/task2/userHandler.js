const express = require('express');
const users = require('./router/users');
const app = express();
app.use(express.json());

app.use('/users', users);

app.listen(3015, () => console.log('Listening at http://localhost:3015'));
