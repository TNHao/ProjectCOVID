const express = require('express');
const path = require('path');
const route = require('./routes');
const handlebars = require('./middlewares/handlebars.middleware');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

handlebars(app);
route(app);


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});


