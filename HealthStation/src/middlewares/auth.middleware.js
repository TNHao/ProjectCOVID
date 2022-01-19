// admin: 1
// manager: 2 (active) and 3 (inactive)
// user: 4

const PERMISSIONS = {
    admin: 1,
    activeManager: 2,
    inactiveManager: 3,
    user: 4
}

module.exports = {
    isUser: (req, res, next) => {
        console.log(req.user)
        // not login yet
        if(!req.user) {
            res.redirect('/login')
        } 
        // login but not as a user
        else if (req.user.permission != PERMISSIONS['user']) {
            res.status(401).redirect('/error/unauthorized')
        }
        // login as a user
        else {
            next()
        }
    },
    isAdmin: (req, res, next) => {
        console.log(req.user)
        // not login yet
        if(!req.user) {
            res.redirect('/login')
        } 
        // login but not as an admin
        else if (req.user.permission != PERMISSIONS['admin']) {
            res.status(401).redirect('/error/unauthorized')
        }
        // login as an admin
        else {
            next()
        }
    },
    isManager: (req, res, next) => {
        console.log(req.user)
        // not login yet
        if(!req.user) {
            res.redirect('/login')
        } 
        // login but not as an active manager
        else if (req.user.permission != PERMISSIONS['activeManager']) {
            console.log(req.user.permission)
            res.status(401).redirect('/error/unauthorized')
        }
        // login as an active manager
        else {
            console.log(req.user.permission)
            next()
        }
    },
}