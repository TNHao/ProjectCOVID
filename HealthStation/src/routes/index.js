const adminRoute = require('./admin.route');
const logInRoute = require('./sites/login.route');
const homeRoute = require('./sites/home.route');
const categoryRoute = require('./sites/category.route');
const productRoute = require('./sites/product.route');
const necessaryPacketRoute = require('./sites/necessaryPacket.route');
const userRoute = require('./user.route');
const managerRoute = require('./manager.route');

function route(app) {
    app.use('/', homeRoute);
    app.use('/category/:id', categoryRoute);
    app.use('/product/:id', productRoute);
    app.use('/necessary-packet/:id', necessaryPacketRoute);
    app.use('/admin', adminRoute);
    app.use('/manager', managerRoute);
    app.use('/user', userRoute);
    app.use('/login', logInRoute);
    app.use((req, res, next) => {
        res.render('404')
    })
}

module.exports = route;