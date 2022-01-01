const { validPassword, issueJWT } = require('../lib/Utils');
const accountModel = require('../models/account');
const authModel = require('../models/auth');

module.exports = {
    getBalance: async (req, res) => {
        const { id } = req.params;
        try {
            const { data } = await accountModel.getBalance(id);
            res.json({ status: 200, msg: "SUCCESS", data });
        } catch (error) {
            res.json({ status: 400, msg: error });
        }
    },
    changePassword: async (req, res) => {
        const { password, newPassword, id } = req.body;
        const { data: account } = await authModel.findUser(id);

        if (!account)
            return res.json({ status: 404, msg: "User not found" })

        const isValid = await validPassword(password, account.password);

        if (!isValid)
            return res.json({ status: 401, msg: "Wrong password" })
        else {
            const { data } = await accountModel.editPassword(id, newPassword);
            return res.json({ status: 200, data })
        }
    }
}