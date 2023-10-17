const express = require('express');
const { port } = require('./config/config');
const app = express();

const episodesRouter = require('./routes/episodes/episodes');
const homeRouter = require('./routes/home/home');
const searchRouter = require('./routes/search/search')
const watchRouter = require('./routes/watch/watch')

app.use('/', episodesRouter);
app.use('/', homeRouter);
app.use('/', searchRouter);
app.use('/', watchRouter);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
