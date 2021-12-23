const adminRoute = require('./admin.route');
const logInRoute = require('./sites/login.route');
const homeRoute = require('./sites/home.route');
const categoryRoute = require('./sites/category.route');
const productRoute = require('./sites/product.route');
const necessaryPacketRoute = require('./sites/necessaryPacket.route');
const userRoute = require('./user.route');

function route(app) {
    app.use('/', homeRoute);
    app.use('/category/:id', categoryRoute);
    app.use('/product/:id', productRoute);
    app.use('/necessary-packet/:id', necessaryPacketRoute);
    app.use('/admin', adminRoute);
    app.use('/user', userRoute);
    app.use('/login', logInRoute);
}

module.exports = route;