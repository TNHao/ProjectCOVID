const { DEPOSIT, WITHDRAWAL, PAYMENT } = require("../constants");
const bcrypt = require('bcrypt')

module.exports = {
    getTransactionName: (action) => {
        switch (action) {
            case DEPOSIT:
                return "Nạp tiền vào tài khoản";
            case WITHDRAWAL:
                return "Rút tiền ra khỏi tài khoản";
            case PAYMENT:
                return "Thanh toán hóa đơn";

            default:
                return "Không rõ";
        }
    },
    generatePassword: async (password) => {
        return await bcrypt.hash(password.toString(), 10)
    },
    randomColor: () => {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `'rgb(${r}, ${g}, ${b})'`
    },
}