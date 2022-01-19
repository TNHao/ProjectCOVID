const { validPassword, issueJWT } = require('../lib/Utils');
const authModel = require('../models/auth');

module.exports = {
    addNewUser: async (req, res) => {
        const { id } = req.body;
        try {
            const { data } = await authModel.addNewUser(id);
            res.json({ status: 200, msg: "SUCCESS", data });
        } catch (error) {
            res.json({ status: 400, msg: error });
        }
    },
    editPassword: async (req, res) => {
        const { password = null, newPassword = null, id } = req.body;
        const { data: user } = await authModel.findUser(id);

        if (user.password) {
            const isValid = await validPassword(password, user.password);
            if (!isValid)
                return res.json({ status: 401, msg: "Wrong password" })
        }

        try {
            const { data } = await authModel.editPassword(id, newPassword);
            res.json({ status: 200, msg: "SUCCESS", data });
        } catch (error) {
            res.json({ status: 400, msg: error });
        }
    },
    login: async (req, res) => {
        const { data } = await authModel.findUser(req.body.id);

        if (!data)
            return res.json({ status: 404, msg: "User not found" })

        const isValid = await validPassword(req.body.password, data.password);

        if (!isValid)
            return res.json({ status: 401, msg: "Wrong password" })
        else {
            const token = issueJWT(req.body.id);
            return res.json({ status: 200, token })
        }
    },
    verify: async (req, res) => {
        const { data } = await authModel.findUser(req.body.id);
        if (!data)
            return res.json({ status: 404, msg: "User not found" })

        if (!data.password)
            return res.json({ status: 200, verified: false })

        return res.json({ status: 200, verified: true })
    }
}