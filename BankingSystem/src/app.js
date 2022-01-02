const express = require('express');
const passport = require('./middlewares/passport');
const cors = require('cors');
const route = require('./routes');
const app = express();
const port = 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

passport(app);
route(app);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});


