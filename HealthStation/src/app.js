const express = require('express');
const path = require('path');
const methodOverride = require('method-override')
const route = require('./routes');
const handlebars = require('./middlewares/handlebars.middleware');
const session = require('./middlewares/session.middleware');
const passport = require('./middlewares/passport.middeware');

const app = express();
const port = 3000;
const userM = require('./models/user/user.model');
const managerM = require('./models/manager/manager.model');
const { rmSync } = require('fs');
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'))

handlebars(app);
session(app);
passport(app);

app.use((req, res, next) => {
  res.locals = { isLoggedIn: req.user ? true : false, user: req.user }
  next();
})

route(app);

app.get('/test', async (req, res) => {
  const rs1 = await managerM.blockManagerWithId(9);
  const rs2 = await managerM.blockManagerWithId(7);
  console.log(rs1, rs2);
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
