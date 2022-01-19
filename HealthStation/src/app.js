const express = require('express');
const path = require('path');
const fs = require('fs');
const methodOverride = require('method-override');
const route = require('./routes');
const handlebars = require('./middlewares/handlebars.middleware');
const session = require('./middlewares/session.middleware');
const passport = require('./middlewares/passport.middeware');

// const app = require("https-localhost")()
const app = express();
const port = 3000;
const userM = require('./models/user/user.model');
const managerM = require('./models/manager/manager.model');
const { rmSync } = require('fs');
const { isFirstGenerate } = require('./models/admin/admin.model');
const { findById } = require('./models/sites/location.model');

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

handlebars(app);
session(app);
passport(app);

app.use((req, res, next) => {
  res.locals = { isLoggedIn: req.user ? true : false, user: req.user };
  next();
});

app.use(async (req, res, next) => {
  const firstGenerate = await isFirstGenerate();
  if (firstGenerate == true) {
    if (req.url != '/admin/firstCreate') {
      req.url = '/admin/firstCreate';
    }
  }
  next();
});
route(app);

app.listen(port, () => {
  console.log(`Example app listening at https://localhost:${port}`);
});
