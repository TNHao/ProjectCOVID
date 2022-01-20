const passport = require("passport");
const { PERMISSIONS } = require("../../constants/index");
const { isValidPassword } = require("../../lib/utils");
const userModel = require("../../models/user/user.model");

module.exports = {
  get: async (req, res) => {
    if (res.locals.isLoggedIn) return res.redirect("/");

    if (req.query.err == "404") {
      return res.render("layouts/sites/login-username", {
        layout: false,
        error: { status: true, msg: "Account not found" },
      });
    }

    const user = req.session.initial;
    req.session.initial = null;
    if (!user) {
      return res.render("layouts/sites/login-username", {
        layout: false,
      });
    }
    const isFirstLogin = await isValidPassword("", user.password);
    return res.render("layouts/sites/login", {
      layout: false,
      user: user,
      isFirstLogin: isFirstLogin,
    });
  },

  loginUsername: async (req, res) => {
    const { username } = req.body;
    const { data: user } = await userModel.findByUsername(username);

    if (!user) {
      return res.redirect("/login?err=404");
    }
    req.session.initial = user;
    res.redirect("/login");
  },

  post: async (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return res.render("layouts/sites/login", {
          error: { status: true, msg: err },
        });
      }

      if (!user) {
        res.render("layouts/sites/login", {
          error: { status: true, msg: info.message },
        });
        return;
      }

      const { permission, username, account_id } = user;

      req.logIn({ permission, username, account_id }, function (err) {
        if (err) {
          res.render("layouts/sites/login", {
            error: { status: true, msg: err },
          });
        } else {
          let url = "/";
          switch (permission) {
            case PERMISSIONS["admin"]:
              url = "/admin";
              break;
            case PERMISSIONS["activeManager"]:
              url = "/manager";
              break;
          }

          return res.redirect(url);
        }
      });
    })(req, res, next);
  },
  createPassword: async (req, res, next) => {
    const { username: username, id: id, Password: password } = req.body;
    await userModel.updatePasswordById(id, password);
    
    req.logIn({ permission: PERMISSIONS['user'], username, id }, function (err) {
      if (err) {
        return res.redirect("/login?err=404");
      } else {
        return res.redirect('/');
      }
    });
  },
};
