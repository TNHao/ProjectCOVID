const adminRoute = require('./admin.route');
const logInRoute = require('./sites/login.route');
const logOutRoute = require('./sites/logout.route');
const homeRoute = require('./sites/home.route');
const categoryRoute = require('./sites/category.route');
const productRoute = require('./sites/product.route');
const necessaryPacketRoute = require('./sites/necessaryPacket.route');
const userRoute = require('./user.route');
const managerRoute = require('./manager.route');
const locationRoute = require('./sites/location.route');
const errorRoute = require('./error.route');
const userM = require('../models/user/user.model');
const { setFirstGenerate } = require('../models/admin/admin.model');
const { isUser, isManager, isAdmin } = require('../middlewares/auth.middleware');
function route(app) {

    app.use('/category', categoryRoute);
    app.use('/product', productRoute);
    app.use('/necessary-packet', necessaryPacketRoute);

    app.use('/admin', isAdmin, adminRoute);
    app.use('/manager', isManager, managerRoute);

    app.use('/user', (req, res, next) => {
        if (res.locals.isLoggedIn) next(); 
        else 
            res.redirect('/login')
    }, userRoute);

    app.use('/login', logInRoute);
    app.use('/logout', logOutRoute);
    app.use('/location', locationRoute);
    app.use('/error', errorRoute)
    app.use('/', homeRoute);
    app.use((req, res, next) => {
        res.render('error/404')
    })

}

module.exports = route;
