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
const userM = require('../models/user/user.model');
const { setFirstGenerate } = require('../models/admin/admin.model');
function route(app) {

    app.use('/category', categoryRoute);
    app.use('/product', productRoute);
    app.use('/necessary-packet', necessaryPacketRoute);
    app.use('/admin', adminRoute);
    app.use('/manager', managerRoute);

    app.use('/user', (req, res, next) => {
        if (res.locals.isLoggedIn) next(); 
        else 
            res.redirect('/login')
    }, userRoute);

    app.use('/login', logInRoute);
    app.use('/logout', logOutRoute);
    app.use('/location', locationRoute);
    app.use('/', homeRoute);
    app.use((req, res, next) => {
        res.render('error/404')
    })

}

module.exports = route;
