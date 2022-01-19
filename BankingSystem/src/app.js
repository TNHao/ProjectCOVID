const express = require('express');
const passport = require('./middlewares/passport');
const cors = require('cors');
const path = require('path');
const https = require('https')
const fs = require('fs')
const route = require('./routes');
const app = express();
const port = 5000;

const credentials  = {
    key: fs.readFileSync(path.join(__dirname, 'config', 'localhost-key.pem'), { encoding: "utf8" }),
    cert: fs.readFileSync(path.join(__dirname, 'config', 'localhost.pem'), { encoding: "utf8" })
  };

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

passport(app);
route(app);

https.createServer(credentials, app).listen(port, () => {
    console.log(`Example app listening at https://localhost:${port}`);
  });