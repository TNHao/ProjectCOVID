const { SALT_ROUND, SECRET_KEY } = require("../constants");
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');

module.exports = {
    genPassword: async (password) => {
        const genHash = await bcrypt.hash(password, SALT_ROUND).then(res => res);
        return genHash;
    },
    validPassword: async (password, db_password) => {
        const isValid = await bcrypt.compare(password, db_password).then(res => res);
        return isValid;
    },
    issueJWT: (id) => {
        const expiresIn = '1d';

        const payload = {
            sub: id,
            iat: Date.now()
        };

        const signedToken = jsonwebtoken.sign(payload, SECRET_KEY, { expiresIn: expiresIn });

        return signedToken;
    }
}